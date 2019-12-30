'use strict'

const User = use('App/Models/User')

class AuthController {
  async register ({ request, response }) {
    const data = request.only(['username', 'email', 'password'])

    if (await User.findBy('email', data.email)) {
      return response.status(400).send({ error: 'User already exists' })
    }

    const user = await User.create(data)

    return user
  }
}

module.exports = AuthController
