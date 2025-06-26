import type { HttpContext } from '@adonisjs/core/http'
import { BettingService } from '#services/betting_service'
import {
  createMatchValidator,
  createBetSlipValidator,
  finishMatchValidator,
} from '#dtos/betting_dto'

export default class BettingController {
  private bettingService: BettingService

  constructor() {
    this.bettingService = new BettingService()
  }

  // === MATCHES ENDPOINTS ===

  /**
   * GET /api/matches
   * Obtener todos los partidos
   */
  async getMatches({ response }: HttpContext) {
    try {
      const matches = await this.bettingService.getAllMatches()

      const formattedMatches = matches.map((match) => ({
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competition: match.competition,
        matchDate: match.matchDate.toISO(),
        status: match.status,
        odds: {
          winner: {
            '1': match.odds1,
            'X': match.oddsX,
            '2': match.odds2,
          },
          doubleChance: {
            '1X': match.odds1X,
            '12': match.odds12,
            'X2': match.oddsX2,
          },
          totalGoals: {
            over_2_5: match.oddsOver25,
            under_2_5: match.oddsUnder25,
          },
          corners: {
            over_6_5: match.oddsOver65Corners,
            under_6_5: match.oddsUnder65Corners,
          },
        },
        result:
          match.status === 'finished'
            ? {
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                totalCorners: match.totalCorners,
              }
            : null,
      }))

      return response.status(200).json({
        success: true,
        message: 'Matches retrieved successfully',
        data: formattedMatches,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * GET /api/matches/upcoming
   * Obtener partidos próximos (disponibles para apostar)
   */
  async getUpcomingMatches({ response }: HttpContext) {
    try {
      const matches = await this.bettingService.getUpcomingMatches()

      const formattedMatches = matches.map((match) => ({
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competition: match.competition,
        matchDate: match.matchDate.toISO(),
        status: match.status,
        odds: {
          winner: {
            '1': match.odds1,
            'X': match.oddsX,
            '2': match.odds2,
          },
          doubleChance: {
            '1X': match.odds1X,
            '12': match.odds12,
            'X2': match.oddsX2,
          },
          totalGoals: {
            over_2_5: match.oddsOver25,
            under_2_5: match.oddsUnder25,
          },
          corners: {
            over_6_5: match.oddsOver65Corners,
            under_6_5: match.oddsUnder65Corners,
          },
        },
      }))

      return response.status(200).json({
        success: true,
        message: 'Upcoming matches retrieved successfully',
        data: formattedMatches,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * GET /api/matches/:id
   * Obtener un partido específico
   */
  async getMatch({ params, response }: HttpContext) {
    try {
      const match = await this.bettingService.getMatchById(params.id)

      if (!match) {
        return response.status(404).json({
          success: false,
          message: 'Match not found',
          data: null,
        })
      }

      const formattedMatch = {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        competition: match.competition,
        matchDate: match.matchDate.toISO(),
        status: match.status,
        odds: {
          winner: {
            '1': match.odds1,
            'X': match.oddsX,
            '2': match.odds2,
          },
          doubleChance: {
            '1X': match.odds1X,
            '12': match.odds12,
            'X2': match.oddsX2,
          },
          totalGoals: {
            over_2_5: match.oddsOver25,
            under_2_5: match.oddsUnder25,
          },
          corners: {
            over_6_5: match.oddsOver65Corners,
            under_6_5: match.oddsUnder65Corners,
          },
        },
        result:
          match.status === 'finished'
            ? {
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                totalCorners: match.totalCorners,
              }
            : null,
      }

      return response.status(200).json({
        success: true,
        message: 'Match retrieved successfully',
        data: formattedMatch,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * POST /api/admin/matches
   * Crear un nuevo partido (solo admin)
   */
  async createMatch({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createMatchValidator)
      const match = await this.bettingService.createMatch(payload)

      return response.status(201).json({
        success: true,
        message: 'Match created successfully',
        data: {
          id: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          competition: match.competition,
          matchDate: match.matchDate.toISO(),
          status: match.status,
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * PUT /api/admin/matches/:id/finish
   * Finalizar un partido con resultados (solo admin)
   */
  async finishMatch({ params, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(finishMatchValidator)
      const match = await this.bettingService.finishMatch(params.id, payload)

      return response.status(200).json({
        success: true,
        message: 'Match finished successfully',
        data: {
          id: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          status: match.status,
          result: {
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            totalCorners: match.totalCorners,
          },
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  // === BET SLIPS ENDPOINTS ===

  /**
   * POST /api/bet-slips
   * Crear una nueva apuesta
   */
  async createBetSlip({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const payload = await request.validateUsing(createBetSlipValidator)

      const betSlip = await this.bettingService.createBetSlip(user.id, payload)


      const formattedBetSlip = {
        id: betSlip.id,
        userId: betSlip.userId,
        totalStake: betSlip.totalStake,
        totalOdds: betSlip.totalOdds,
        potentialPayout: betSlip.potentialPayout,
        status: betSlip.status,
        type: betSlip.type,
        createdAt: betSlip.createdAt.toISO(),
        bets: betSlip.bets.map((bet) => ({
          id: bet.id,
          matchId: bet.matchId,
          betType: bet.betType,
          odds: bet.odds,
          result: bet.result,
          match: {
            homeTeam: bet.match.homeTeam,
            awayTeam: bet.match.awayTeam,
            competition: bet.match.competition,
            matchDate: bet.match.matchDate.toISO(),
            status: bet.match.status,
          },
        })),
      }

      return response.status(201).json({
        success: true,
        message: 'Bet slip created successfully',
        data: formattedBetSlip,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * GET /api/bet-slips
   * Obtener las apuestas del usuario autenticado
   */
  async getUserBetSlips({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)

      const betSlips = await this.bettingService.getUserBetSlips(user.id, page, limit)

      const formattedBetSlips = betSlips.map((betSlip) => ({
        id: betSlip.id,
        userId: betSlip.userId,
        totalStake: betSlip.totalStake,
        totalOdds: betSlip.totalOdds,
        potentialPayout: betSlip.potentialPayout,
        status: betSlip.status,
        type: betSlip.type,
        createdAt: betSlip.createdAt.toISO(),
        bets: betSlip.bets.map((bet) => ({
          id: bet.id,
          matchId: bet.matchId,
          betType: bet.betType,
          odds: bet.odds,
          result: bet.result,
          match: {
            homeTeam: bet.match.homeTeam,
            awayTeam: bet.match.awayTeam,
            competition: bet.match.competition,
            matchDate: bet.match.matchDate.toISO(),
            status: bet.match.status,
          },
        })),
      }))

      return response.status(200).json({
        success: true,
        message: 'Bet slips retrieved successfully',
        data: formattedBetSlips,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }

  /**
   * GET /api/bet-slips/:id
   * Obtener una apuesta específica
   */
  async getBetSlip({ auth, params, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const betSlip = await this.bettingService.getBetSlipById(params.id)

      if (!betSlip) {
        return response.status(404).json({
          success: false,
          message: 'Bet slip not found',
          data: null,
        })
      }

      // Verificar que la apuesta pertenece al usuario
      if (betSlip.userId !== user.id) {
        return response.status(403).json({
          success: false,
          message: 'Access denied',
          data: null,
        })
      }

      const formattedBetSlip = {
        id: betSlip.id,
        userId: betSlip.userId,
        totalStake: betSlip.totalStake,
        totalOdds: betSlip.totalOdds,
        potentialPayout: betSlip.potentialPayout,
        status: betSlip.status,
        type: betSlip.type,
        createdAt: betSlip.createdAt.toISO(),
        bets: betSlip.bets.map((bet) => ({
          id: bet.id,
          matchId: bet.matchId,
          betType: bet.betType,
          odds: bet.odds,
          result: bet.result,
          match: {
            homeTeam: bet.match.homeTeam,
            awayTeam: bet.match.awayTeam,
            competition: bet.match.competition,
            matchDate: bet.match.matchDate.toISO(),
            status: bet.match.status,
          },
        })),
      }

      return response.status(200).json({
        success: true,
        message: 'Bet slip retrieved successfully',
        data: formattedBetSlip,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
        data: null,
      })
    }
  }
}
