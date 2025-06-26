import { MatchRepository } from '#repositories/match_repository'
import { BetSlipRepository } from '#repositories/bet_slip_repository'
import { UserRepository } from '#repositories/user_repository'
import { CreateBetSlipDto, CreateMatchDto, FinishMatchDto } from '#dtos/betting_dto'
import Match from '#models/match'
import BetSlip from '#models/bet_slip'

export class BettingService {
  private matchRepository: MatchRepository
  private betSlipRepository: BetSlipRepository
  private userRepository: UserRepository

  constructor() {
    this.matchRepository = new MatchRepository()
    this.betSlipRepository = new BetSlipRepository()
    this.userRepository = new UserRepository()
  }

  // === MATCHES ===
  async getAllMatches(): Promise<Match[]> {
    return this.matchRepository.findAll()
  }

  async getUpcomingMatches(): Promise<Match[]> {
    return this.matchRepository.findUpcoming()
  }

  async getMatchById(id: number): Promise<Match | null> {
    return this.matchRepository.findById(id)
  }

  async createMatch(data: CreateMatchDto): Promise<Match> {
    return this.matchRepository.create(data)
  }

  async finishMatch(id: number, data: FinishMatchDto): Promise<Match> {
    const match = await this.matchRepository.finishMatch(id, data)
    if (!match) {
      throw new Error('Match not found')
    }

    // Procesar todas las apuestas pendientes para este partido
    await this.processMatchBets(match)

    return match
  }

  // === BET SLIPS ===
  async createBetSlip(userId: number, data: CreateBetSlipDto): Promise<BetSlip> {
    // Verificar que el usuario existe y tiene suficiente balance
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.balance < data.totalStake) {
      throw new Error('Insufficient balance')
    }

    // Verificar que todos los partidos existen y están disponibles para apostar
    const betsData = []
    let totalOdds = data.type === 'parlay' ? 1 : 0

    for (const bet of data.bets) {
      const match = await this.matchRepository.findById(bet.matchId)
      if (!match) {
        throw new Error(`Match with ID ${bet.matchId} not found`)
      }

      if (match.status !== 'upcoming') {
        throw new Error(`Match ${match.homeTeam} vs ${match.awayTeam} is not available for betting`)
      }

      // Obtener los momios según el tipo de apuesta
      const odds = this.getOddsForBetType(match, bet.betType)

      betsData.push({
        matchId: bet.matchId,
        betType: bet.betType,
        odds: odds,
      })

      // Calcular momios totales
      if (data.type === 'parlay') {
        totalOdds *= odds
      } else {
        totalOdds = odds // Para apuestas simples, solo hay un momio
      }
    }

    const potentialWin = data.totalStake * totalOdds

    // Crear el bet slip
    const betSlip = await this.betSlipRepository.create(userId, data, totalOdds, potentialWin)

    // Crear las apuestas individuales
    await this.betSlipRepository.createBets(betSlip.id, betsData)

    // Descontar el stake del balance del usuario
    await this.userRepository.updateBalance(userId, user.balance - data.totalStake)

    // Cargar las relaciones para devolver el bet slip completo
    return (await this.betSlipRepository.findById(betSlip.id)) as BetSlip
  }

  async getUserBetSlips(userId: number, page: number = 1, limit: number = 20): Promise<BetSlip[]> {
    return this.betSlipRepository.findByUserId(userId, page, limit)
  }

  async getBetSlipById(id: number): Promise<BetSlip | null> {
    return this.betSlipRepository.findById(id)
  }

  // === PRIVATE METHODS ===
  private getOddsForBetType(match: Match, betType: string): number {
    const oddsMap: { [key: string]: number } = {
      '1': match.odds1,
      'X': match.oddsX,
      '2': match.odds2,
      '1X': match.odds1X,
      '12': match.odds12,
      'X2': match.oddsX2,
      'over_2_5': match.oddsOver25,
      'under_2_5': match.oddsUnder25,
      'over_6_5_corners': match.oddsOver65Corners,
      'under_6_5_corners': match.oddsUnder65Corners,
    }

    const odds = oddsMap[betType]
    if (!odds) {
      throw new Error(`Invalid bet type: ${betType}`)
    }

    return odds
  }

  private async processMatchBets(match: Match): Promise<void> {
    const pendingBetSlips = await this.betSlipRepository.findPendingBetSlips()

    for (const betSlip of pendingBetSlips) {
      const matchBets = betSlip.bets.filter((bet) => bet.matchId === match.id)

      if (matchBets.length === 0) continue

      // Evaluar cada apuesta de este partido
      for (const bet of matchBets) {
        bet.result = this.evaluateBet(match, bet.betType)
        await bet.save()
      }

      // Evaluar el estado general del bet slip
      await this.evaluateBetSlip(betSlip)
    }
  }

  private evaluateBet(match: Match, betType: string): 'won' | 'lost' {
    const homeScore = match.homeScore!
    const awayScore = match.awayScore!
    const totalGoals = homeScore + awayScore
    const totalCorners = match.totalCorners!

    switch (betType) {
      case '1':
        return homeScore > awayScore ? 'won' : 'lost'
      case 'X':
        return homeScore === awayScore ? 'won' : 'lost'
      case '2':
        return awayScore > homeScore ? 'won' : 'lost'
      case '1X':
        return homeScore >= awayScore ? 'won' : 'lost'
      case '12':
        return homeScore !== awayScore ? 'won' : 'lost'
      case 'X2':
        return awayScore >= homeScore ? 'won' : 'lost'
      case 'over_2_5':
        return totalGoals > 2.5 ? 'won' : 'lost'
      case 'under_2_5':
        return totalGoals < 2.5 ? 'won' : 'lost'
      case 'over_6_5_corners':
        return totalCorners > 6.5 ? 'won' : 'lost'
      case 'under_6_5_corners':
        return totalCorners < 6.5 ? 'won' : 'lost'
      default:
        throw new Error(`Unknown bet type: ${betType}`)
    }
  }

  private async evaluateBetSlip(betSlip: BetSlip): Promise<void> {
    await betSlip.load('bets')
    const bets = betSlip.bets

    // Verificar si todas las apuestas han sido evaluadas
    const pendingBets = bets.filter((bet) => bet.result === 'pending' || bet.result === null)
    if (pendingBets.length > 0) {
      return // Aún hay apuestas pendientes
    }

    let betSlipStatus: 'won' | 'lost' | 'cancelled'

    if (betSlip.type === 'parlay') {
      // En parlay, todas las apuestas deben ganar
      const hasLostBet = bets.some((bet) => bet.result === 'lost')
      const hasCancelledBet = bets.some((bet) => bet.result === 'cancelled')

      if (hasLostBet) {
        betSlipStatus = 'lost'
      } else if (hasCancelledBet) {
        betSlipStatus = 'cancelled'
      } else {
        betSlipStatus = 'won'
      }
    } else {
      // Para apuestas simples, el resultado depende de la única apuesta
      const bet = bets[0]
      betSlipStatus = bet.result as 'won' | 'lost' | 'cancelled'
    }

    // Actualizar el estado del bet slip
    await this.betSlipRepository.updateStatus(betSlip.id, betSlipStatus)

    // Sí ganó, agregar las ganancias al balance del usuario
    if (betSlipStatus === 'won') {
      const user = await this.userRepository.findById(betSlip.userId)
      if (user) {
        const newBalance = user.balance + betSlip.potentialWin
        await this.userRepository.updateBalance(user.id, newBalance)
      }
    }

    // Si fue cancelado, devolver el stake
    if (betSlipStatus === 'cancelled') {
      const user = await this.userRepository.findById(betSlip.userId)
      if (user) {
        const newBalance = user.balance + betSlip.totalStake
        await this.userRepository.updateBalance(user.id, newBalance)
      }
    }
  }
}
