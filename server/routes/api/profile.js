import express from 'express';
import Profile from '../../controllers/profile';
import auth from '../../middlewares/auth';
import { validateProfile } from '../../middlewares/validateProfile';

const profile = new Profile();

const router = express.Router();

router.get('/me', auth, profile.currentUserProfile);
router.post('/', [auth, validateProfile], profile.createOrUpdateProfile);
export default router;
