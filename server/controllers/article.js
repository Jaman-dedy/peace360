import { validationResult } from 'express-validator';
import Article from '../models/Article';
import User from '../models/User';

class ArticleController {
  async createArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newArticle = new Article({
        text: req.body.text,
        tags: req.body.tags,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const article = await newArticle.save();
      res.status(201).json({
        status: 201,
        article
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: err
      });
    }
  }

  async getAllArticle(req, res) {
    try {
      const articles = await Article.find({ approved: true }).sort({
        date: -1
      });
      res.status(200).json({
        status: 200,
        articles
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }
  async getArticles(req, res) {
    try {
      const articles = await Article.find().sort({
        date: -1
      });
      res.status(200).json({
        status: 200,
        articles
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }

  async getOneArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Item not found'
        });
      }
      res.status(200).json({
        status: 200,
        article
      });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          status: 404,
          error: 'Item not found'
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Server error'
      });
    }
  }
  async updateArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      const article = await Article.findById(req.params.article_id);
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Item not found'
        });
      }
      if (article.user.toString() !== req.user.id) {
        return res.status(401).json({
          status: 401,
          error: 'Action denied'
        });
      }
      const updatedArticle = {
        text: req.body.text
      };
      const articleUpdated = await Article.findOneAndUpdate(
        { _id: req.params.article_id },
        updatedArticle
      );
      res.status(200).json({ status: 200, updatedArticle });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }
  async deleteOneArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      if (article.user.toString() !== req.user.id) {
        return res.status(401).json({
          status: 401,
          error: 'Action denied'
        });
      }
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Item not found'
        });
      }
      await article.remove();
      return res.status(200).json({
        status: 200,
        error: 'Article removed'
      });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          status: 404,
          error: 'Item not found'
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Server error'
      });
    }
  }
  async likeArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      //check on the user who likes the current article

      if (
        article.likes.filter(like => like.user.toString() === req.user.id)
          .length > 0
      ) {
        const removeIndex = article.likes
          .map(like => like.user.toString())
          .indexOf(req.user.id);
        article.likes.splice(removeIndex, 1);
        await article.save();
        const disliked = article.likes;
        return res.status(200).json({
          status: 200,
          message: 'Article disliked',
          disliked
        });
      }
      article.likes.unshift({ user: req.user.id });
      await article.save();
      const liked = article.likes;
      return res.status(200).json({
        status: 200,
        message: 'Article liked',
        liked
      });
    } catch (error) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          status: 404,
          error: 'Item not found'
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Server error'
      });
    }
  }
  async rateArticle(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      const newRate = {
        user: req.user.id,
        rate: req.body.rate
      };
      if (
        article.ratings.filter(rating => rating.user.toString() === req.user.id)
          .length > 0
      ) {
        const removeIndex = article.ratings
          .map(rating => rating.user.toString())
          .indexOf(req.user.id);
        article.ratings.splice(removeIndex, 1, newRate);
        console.log('removeIndex', removeIndex);
        await article.save();
        const rating = article.ratings[0];
        return res.status(201).json({
          status: 201,
          rating
        });
      }
      article.ratings.unshift(newRate);
      await article.save();
      const rating = article.ratings[0];
      return res.status(201).json({
        status: 201,
        rating
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }
  async approveArticle(req, res) {
    try {
      let approve;
      const article = await Article.findById(req.params.article_id);
      approve = article.approved;
      const updateApproval = {
        approved: !approve
      };
      const approveArticle = await Article.findOneAndUpdate(
        { _id: req.params.article_id },
        updateApproval
      );
      approve = approveArticle.approved;
      res.status(200).json({ status: 200, updateApproval });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }
}

export default ArticleController;
