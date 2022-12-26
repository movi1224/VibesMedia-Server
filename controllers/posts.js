import Post from '../models/Post.js'
import User from '../models/User.js'

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    })
    await newPost.save()

    const post = await Post.find() // grabing all the posts, 给前端返回一个list of all updated posts
    res.status(201).json(post)
  } catch (err) {}
}

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find()
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const post = await Post.find({ userId })
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/*  UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params // get relevant post
    const { userId } = req.body // 注意这里userId在body中获取
    const post = await Post.findById(id)
    const isLiked = post.likes.get(userId) // check likes 里面有无这个userId

    if (isLiked) {
      post.likes.delete(userId) // 如果like了 在post.likes中删除这个id
    } else post.likes.set(userId, true)

    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true }) // 更新这个Post的信息

    res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params // get relevant post
    const { userId } = req.body // 注意这里userId在body中获取
    const post = await Post.findById(id)
    const postOwnerId = post.userId

    // 验证当前用户是否是这个post的创建用户
    if (postOwnerId === userId) {
      await Post.findByIdAndDelete(id) // 删除这个Post的信息
      const post = await Post.find() // 重新获取所有post
      res.status(200).json(post)
    } else
      res.status(403).json({ message: 'Cannot delete the post not belong to the current user' })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
