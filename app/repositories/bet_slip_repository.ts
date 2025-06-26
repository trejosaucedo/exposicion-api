import BetSlip from '#models/bet_slip'
import Bet from '#models/bet'
import { CreateBetSlipDto } from '#dtos/betting_dto'

export class BetSlipRepository {
  async findByUserId(userId: number, page: number = 1, limit: number = 20): Promise<BetSlip[]> {
    return BetSlip.query()
      .where('user_id', userId)
      .preload('bets', (betQuery) => {
        betQuery.preload('match')
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
      .then((result) => result.all())
  }

  async findById(id: number): Promise<BetSlip | null> {
    return BetSlip.query()
      .where('id', id)
      .preload('bets', (betQuery) => {
        betQuery.preload('match')
      })
      .first()
  }

  async create(
    userId: number,
    data: CreateBetSlipDto,
    totalOdds: number,
    potentialPayout: number
  ): Promise<BetSlip> {
    return await BetSlip.create({
      userId,
      totalStake: data.totalStake,
      totalOdds,
      potentialPayout,
      type: data.type,
      status: 'pending',
    })
  }

  async createBets(betSlipId: number, betsData: any[]): Promise<Bet[]> {
    const bets = []
    for (const betData of betsData) {
      const bet = await Bet.create({
        betSlipId,
        matchId: betData.matchId,
        betType: betData.betType,
        odds: betData.odds,
        result: 'pending',
      })
      bets.push(bet)
    }
    return bets
  }

  async updateStatus(
    id: number,
    status: 'pending' | 'won' | 'lost' | 'cancelled'
  ): Promise<BetSlip | null> {
    const betSlip = await this.findById(id)
    if (!betSlip) return null

    betSlip.status = status
    await betSlip.save()
    return betSlip
  }

  async findPendingBetSlips(): Promise<BetSlip[]> {
    return BetSlip.query()
      .where('status', 'pending')
      .preload('bets', (betQuery) => {
        betQuery.preload('match')
      })
  }
}
