import User from '../models/User';

const checkAdmin = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user.isAdmin) {
      return res.status(401).json({
        status: 401,
        error: 'Access denied'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

export { checkAdmin };
