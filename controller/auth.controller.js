const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../model/database")
const User = db.users

const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      if (!(email && password)) {
        return res.json({ status: 400, msg: "Please input the credentials" })
      }

      const user = await User.findOne({ where: { email } })

      if (user && (await bcrypt.compare(password, user.pwd))) {
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        )

        user.token = token

        return res.json({ status: 200, user })
      }

      res.json({ status: 400, msg: "Invalid Credentials" })
    } catch (error) {
      console.error(error)
    }
  },

  register: async (req, res) => {
    try {
      const { first_name, last_name, email, password, username } = req.body

      if (!(first_name && last_name && email && password && username)) {
        return res.json({ status: 400, msg: "Please input all informations" })
      }

      const user = await User.findOne({ where: { email } })

      if (user) {
        return res.json({
          status: 409,
          msg: "This email already exist, Please login",
        })
      }

      const enryptedPWD = await bcrypt.hash(password, 10)

      // const maxId = (await User.max("id")) + 1

      // console.log(maxId)
      const newUser = await User.create({
        // id: maxId,
        first_name,
        last_name,
        username,
        email: email.toLowerCase(),
        pwd: enryptedPWD,
      })

      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      )
      newUser.token = token

      res.status(201).json(newUser)
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = AuthController
