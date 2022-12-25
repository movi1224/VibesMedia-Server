import mongoose from 'mongoose'

//Schema
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    }, // Map比Arr更加efficient
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', PostSchema) // using the schema above to create a model

export default Post
