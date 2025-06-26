import Match from '#models/match'
import { CreateMatchDto, FinishMatchDto } from '#dtos/betting_dto'
import { DateTime } from 'luxon'

export class MatchRepository {
  async findAll(): Promise<Match[]> {
    return Match.query().orderBy('match_date', 'asc')
  }

  async findUpcoming(): Promise<Match[]> {
    return Match.query()
      .where('status', 'upcoming')
      .where('match_date', '>', new Date())
      .orderBy('match_date', 'asc')
  }

  async findById(id: number): Promise<Match | null> {
    return Match.find(id)
  }

  async create(data: CreateMatchDto): Promise<Match> {
    return Match.create({
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      competition: data.competition,
      matchDate: DateTime.fromJSDate(data.matchDate),
      odds1: data.odds1,
      oddsX: data.oddsX,
      odds2: data.odds2,
      odds1X: data.odds1X,
      odds12: data.odds12,
      oddsX2: data.oddsX2,
      oddsOver25: data.oddsOver25,
      oddsUnder25: data.oddsUnder25,
      oddsOver65Corners: data.oddsOver65Corners,
      oddsUnder65Corners: data.oddsUnder65Corners,
      status: 'upcoming',
    })
  }

  async finishMatch(id: number, data: FinishMatchDto): Promise<Match | null> {
    const match = await this.findById(id)
    if (!match) return null

    match.merge({
      homeScore: data.homeScore,
      awayScore: data.awayScore,
      totalCorners: data.totalCorners,
      status: 'finished',
    })

    await match.save()
    return match
  }

  async updateStatus(
    id: number,
    status: 'upcoming' | 'live' | 'finished' | 'cancelled'
  ): Promise<Match | null> {
    const match = await this.findById(id)
    if (!match) return null

    match.status = status
    await match.save()
    return match
  }
}
