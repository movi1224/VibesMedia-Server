import express from 'express'
import { getUser, getUserFriends, addRemoveFriend } from '../controllers/users.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// read router (R of CRUD)
router.get('/:id', verifyToken, getUser) // :id表示是动态的, 指代用户id
router.get('/:id/friends', verifyToken, getUserFriends) // 获取friends

// Update
router.patch('/:id/:friendId', verifyToken, addRemoveFriend) // 操作某个好友

export default router
