import jwt from 'jsonwebtoken'

// 创建一个验证token的中间件
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization') // 前端会set一个这个Authorization, 也就是token存放的位置, 所以我们grab他

    if (!token) return res.status(403).send('Access Denied')

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft() // 提取token, Bearer也是前端set的东西, j-w-token会被放在这个string后面
      console.log(token)
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET) // 验证juwt
    req.user = verified // 中间件真正做的事情: 验证req中的user

    next() // 表明这是中间件, next触发引用该函数的函数下一步的内容
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
