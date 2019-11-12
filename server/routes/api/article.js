import express from 'express';
import Article from '../../controllers/article';
import auth from '../../middlewares/auth';
import { validateText } from '../../middlewares/validateText';
import { checkAdmin } from '../../middlewares/isAdmin';
import { checkUserFavoriteArticle } from '../../middlewares/checkUser';

const article = new Article();

const router = express.Router();

router.post('/', [auth, validateText], article.createArticle);
router.get('/', article.getAllArticle);
router.get('/admin', [auth, checkAdmin], article.getArticles);
router.get('/:article_id', article.getOneArticle);
router.put('/:article_id', [auth, validateText], article.updateArticle);
router.delete('/:article_id', auth, article.deleteOneArticle);
router.put(
  '/like/:article_id',
  [auth, checkUserFavoriteArticle],
  article.likeArticle
);
router.put(
  '/rate/:article_id',
  [auth, checkUserFavoriteArticle],
  article.rateArticle
);
router.put('/approve/:article_id', auth, article.approveArticle);

export default router;
