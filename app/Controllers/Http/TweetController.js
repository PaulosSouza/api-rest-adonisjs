'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Tweet = use('App/Models/Tweet')

/**
 * Resourceful controller for interacting with tweets
 */
class TweetController {
  /**
   * Show a list of all tweets.
   * GET tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const tweets = await Tweet.query()
      .with('users')
      .fetch()

    return tweets
  }

  /**
   * Create/save a new tweet.
   * POST tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth }) {
    const data = request.only(['content'])

    const tweet = await Tweet.create({ user_id: auth.user.id, ...data })

    return tweet
  }

  /**
   * Display a single tweet.
   * GET tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const tweet = await Tweet.findOrFail(params.id)

    return tweet
  }

  /**
   * Update tweet details.
   * PUT or PATCH tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, auth, response }) {
    const data = request.all()

    const tweet = await Tweet.findOrFail(params.id)

    if (tweet.user_id !== auth.user.id) {
      return response.status(401)
    }

    tweet.merge({ ...data })

    await tweet.save()

    return tweet
  }

  /**
   * Delete a tweet with id.
   * DELETE tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const tweet = await Tweet.findOrFail(params.id)

    if (tweet.user_id !== auth.user.id) {
      return response.status(401)
    }

    await tweet.delete()
  }
}

module.exports = TweetController
