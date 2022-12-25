import express from 'express'
import { login } from '../controllers/auth.js'

const router = express.Router() // 让express知道这个router会被configure在这里

router.post('/login', login) // 别忘了index中已经给这个加了prefix '/auth'

export default router
