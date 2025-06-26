// app/dtos/betting_dto.ts
import vine from '@vinejs/vine'

const betSchema = vine.object({
  matchId: vine.number().min(1),
  betType: vine.enum([
    '1',
    'X',
    '2',
    '1X',
    '12',
    'X2',
    'over_2_5',
    'under_2_5',
    'over_6_5_corners',
    'under_6_5_corners',
  ]),
})

// Validador para crear un partido
export const createMatchValidator = vine.compile(
  vine.object({
    homeTeam: vine.string().trim().minLength(2).maxLength(100),
    awayTeam: vine.string().trim().minLength(2).maxLength(100),
    competition: vine.string().trim().minLength(2).maxLength(100),
    matchDate: vine.string().transform((value) => {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid date format')
      }
      return date
    }),
    odds1: vine.number().min(1.01).max(50),
    oddsX: vine.number().min(1.01).max(50),
    odds2: vine.number().min(1.01).max(50),
    odds1X: vine.number().min(1.01).max(50),
    odds12: vine.number().min(1.01).max(50),
    oddsX2: vine.number().min(1.01).max(50),
    oddsOver25: vine.number().min(1.01).max(50),
    oddsUnder25: vine.number().min(1.01).max(50),
    oddsOver65Corners: vine.number().min(1.01).max(50),
    oddsUnder65Corners: vine.number().min(1.01).max(50),
  })
)

// Validador para una apuesta individual
export const betValidator = vine.compile(
  vine.object({
    matchId: vine.number().min(1),
    betType: vine.enum([
      '1',
      'X',
      '2',
      '1X',
      '12',
      'X2',
      'over_2_5',
      'under_2_5',
      'over_6_5_corners',
      'under_6_5_corners',
    ]),
  })
)

// Validador para crear un slip de apuestas
export const createBetSlipValidator = vine.compile(
  vine.object({
    totalStake: vine.number().min(1).max(10000),
    type: vine.enum(['single', 'multiple']),
    bets: vine.array(betSchema).minLength(1).maxLength(20),
  })
)

// Validador para finalizar un partido (admin)
export const finishMatchValidator = vine.compile(
  vine.object({
    homeScore: vine.number().min(0).max(20),
    awayScore: vine.number().min(0).max(20),
    totalCorners: vine.number().min(0).max(50),
  })
)

// Interfaces
export interface CreateMatchDto {
  homeTeam: string
  awayTeam: string
  competition: string
  matchDate: Date
  odds1: number
  oddsX: number
  odds2: number
  odds1X: number
  odds12: number
  oddsX2: number
  oddsOver25: number
  oddsUnder25: number
  oddsOver65Corners: number
  oddsUnder65Corners: number
}

export interface BetDto {
  matchId: number
  betType: string
}

export interface CreateBetSlipDto {
  totalStake: number
  type: 'single' | 'multiple'
  bets: BetDto[]
}

export interface FinishMatchDto {
  homeScore: number
  awayScore: number
  totalCorners: number
}

export interface MatchResponse {
  id: number
  homeTeam: string
  awayTeam: string
  competition: string
  matchDate: string
  status: string
  odds: {
    winner: {
      '1': number
      'X': number
      '2': number
    }
    doubleChance: {
      '1X': number
      '12': number
      'X2': number
    }
    totalGoals: {
      over_2_5: number
      under_2_5: number
    }
    corners: {
      over_6_5: number
      under_6_5: number
    }
  }
  result?: {
    homeScore: number
    awayScore: number
    totalCorners: number
  }
}

export const balanceValidator = vine.compile(
  vine.object({
    amount: vine.number().min(0.01).max(100000),
  })
)

export const updateBalanceValidator = vine.compile(
  vine.object({
    balance: vine.number().min(0).max(1000000),
  })
)

export interface BetSlipResponse {
  id: number
  userId: number
  totalStake: number
  totalOdds: number
  potentialPayout: number
  status: string
  type: string
  createdAt: string
  bets: {
    id: number
    matchId: number
    betType: string
    odds: number
    result: string | null
    match: {
      homeTeam: string
      awayTeam: string
      competition: string
      matchDate: string
      status: string
    }
  }[]
}
