import express from 'express';
import Users from '../../controllers/users';
import Follower from '../../controllers/follower';
import {
  validateUser,
  validateUserLogin
} from '../../middlewares/validateUser';
import { checkUser, checkUserLogin } from '../../middlewares/checkUser';
import auth from '../../middlewares/auth';
import { checkFollowers } from '../../middlewares/checkFollowers';

const users = new Users();
const follower = new Follower();

const router = express.Router();

router.post('/', validateUser, checkUser, users.signup);
router.post('/login', validateUserLogin, checkUserLogin, users.login);
router.post('/send-email', users.checkEmail);
router.put('/reset-password', users.resetPassword);
router.put('/follow/:article_id', [auth], follower.followUser);
router.get('/followers', auth, follower.getFollowers);
router.get('/followings', auth, follower.getFollowings);

export default router;
