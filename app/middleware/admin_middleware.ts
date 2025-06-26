import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    try {
      const user = await ctx.auth.getUserOrFail()

      if (user.role !== 'admin') {
        return ctx.response.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.',
          data: null,
        })
      }

      await next()
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Authentication required',
        data: null,
      })
    }
  }
}
