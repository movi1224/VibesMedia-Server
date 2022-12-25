import express from 'express'
import { getFeedPosts, getUserPosts, likePost } from '../controllers/posts.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

/* READ */
router.get('/', verifyToken, getFeedPosts) // home page显示用户的feed post
router.get('/:userId', verifyToken, getUserPosts) // 用户post页面 查看当前用户的所有post

/* UPDATE */
router.patch('/:id/like', verifyToken, likePost) // 负责like逻辑

export default router
