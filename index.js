import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from './middleware/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url) // use with module to grab the directory name
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))) // set the directory of storage of assets

/* FILES STORAGE CONFIG (using malter to save our files: Multer 是一个node.js中间件，用于处理 multipart/form-data类型的表单数据，主要用于上传文件) */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register)
// 第一个参数后的都是中间件(register/assets), upload用来上传图片, verifytoken用来验证jwt(不放在这, 因为这里还没有拿到username)
// 所有的中间件param都要before register这个endpoint
app.post('/posts', verifyToken, upload.single('picture'), createPost)

/* ROUTES */
app.use('/auth', authRoutes) // 验证页面
app.use('/users', userRoutes) // 用户页面
app.use('/posts', postRoutes) // posts页面

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
    /* ADD DATA ONE TIME (简单插入一些Mock Data, 下面的代码跑一次成功了就行了 要不然每次启动都会给db添加一遍*/
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((err) => console.log(`${err} did not connect!`))
