import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FollowerSchema = new Schema({
  followedUser: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  followedBy: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ]
});

export default mongoose.model('follower', FollowerSchema);
