import bcrypt from 'bcrypt' //用以加密
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/* REGISTER USER */
export const register = async (req, res) => {
  // 如果要call mongodb必须是async
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } =
      req.body

    const salt = await bcrypt.genSalt() // 用Salt来encrypt password
    const passwordHash = await bcrypt.hash(password, salt)
    // 加密完成后可以储存新用户数据啦 (后面两个是mock的数据暂时不做这个功能)
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewdProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser) //201表示something has been created, send this respond from server to frontend
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).json({ msg: 'User does not exist.' }) // 如果没找到提示用户不存在
    const isMatch = await bcrypt.compare(password, user.password) // 如果找到用户 核对密码
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET) // 创建JWT用以记录用户登录
    delete user.password // 删除这个password以确保不会被发送到前端
    res.status(200).json({ token, user }) // 服务器发送回应给客户端(给客户端传这个user信息和对应的token => 作为validation让用户登入)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
