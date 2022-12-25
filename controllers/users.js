import User from '../models/User.js'

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id) // 从前端获取id找到user即可
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id) // 先获取该用户

    const friends = await Promise.all(user.friends.map((id) => User.findById(id))) // 获取每一个friend

    const formattedFriends = friends.map(
      // 给获取的每一个friend做一个格式, 就是按照所需的几个信息来 然后返回即可
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params //  需要从请求中获取到当前用户id和要操作的好友id
    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    if (user.friends.includes(friendId)) {
      // 如果要操作的用户在好友列表中则删除(双向)
      user.friends = user.friends.filter((id) => id !== friendId)
      friend.friends = friend.friends.filter((id) => id !== id)
    } else {
      // 否则添加好友(双向)
      user.friends.push(friendId)
      friend.friends.push(id)
    }

    await user.save()
    await friend.save()
    // 再重新格式一下好友列表
    const friends = await Promise.all(user.friends.map((id) => User.findById(id))) // 获取每一个friend
    const formattedFriends = friends.map(
      // 给获取的每一个friend做一个格式, 就是按照所需的几个信息来 然后返回即可
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
