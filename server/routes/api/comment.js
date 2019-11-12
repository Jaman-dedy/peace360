import express from 'express';
import auth from '../../middlewares/auth';
import { validateText } from '../../middlewares/validateText';
import Comment from '../../controllers/comment';

const comment = new Comment();

const router = express.Router();

router.post('/:article_id', [auth, validateText], comment.createComment);
router.put('/:article_id/:comment_id',[ auth, validateText], comment.updateComment);
router.delete('/:article_id/:comment_id', auth, comment.deleteComment);

export default router;
