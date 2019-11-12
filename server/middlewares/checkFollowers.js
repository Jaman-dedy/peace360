import Followers from '../models/Followers';

const checkFollowers = async (req, res, next) => {
  try {
    const followers = await Followers.find();
    if (
      followers.map(
        follower =>
          follower.followedBy.filter(
            followedBy => followedBy.user.toString() === req.user.id
          ).length > 0
      )
    ) {
      return res.status(400).json({
        status: 400,
        msg: 'dkdkdkdk'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
};

export { checkFollowers };
