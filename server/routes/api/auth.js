import express from 'express';
import Users from '../../controllers/users';
import auth from '../../middlewares/auth';


const authenticatedUser = new Users();

const router = express.Router();


router.get('/', auth, authenticatedUser.getAuthenticatedUser);

export default router;