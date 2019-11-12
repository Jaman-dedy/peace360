import { validationResult } from 'express-validator';
import Article from '../models/Article';
import User from '../models/User';

class CommentController {
  async createComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const article = await Article.findById(req.params.article_id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      article.comments.unshift(newComment);
      await article.save();
      const comment = article.comments[0];
      res.status(201).json({
        status: 201,
        comment
      });
    } catch (err) {
      console.log('err', err);
      res.status(500).json({
        status: 500,
        err: err
      });
    }
  }
  async updateComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      const article = await Article.findById(req.params.article_id);
      const comment = article.comments.find(
        comment => (comment.id = req.params.comment_id)
      );

      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({
          status: 401,
          error: 'Action denied'
        });
      }
      if (!comment) {
        return res.status(404).json({
          status: 404,
          error: 'Comment not found'
        });
      }

      const updatedIndex = article.comments
        .map(comment => comment.id.toString())
        .indexOf(req.params.comment_id);

      const user = await User.findById(req.user.id).select('-password');
      const updateComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      article.comments.splice(updatedIndex, 1, updateComment);
      await article.save();
      const commentUpdated = article.comments;
      res.status(200).json({
        status: 200,
        commentUpdated
      });
    } catch (error) {
      console.log('error', error);
      res.status(500).json({
        status: 500,
        error: error
      });
    }
  }
  async deleteComment(req, res) {
    try {
      const article = await Article.findById(req.params.article_id);
      const comment = article.comments.find(
        comment => (comment.id = req.params.comment_id)
      );
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({
          status: 401,
          error: 'Action denied'
        });
      }
      if (!comment) {
        return res.status(404).json({
          status: 404,
          error: 'Comment not found'
        });
      }
      const removedIndex = article.comments
        .map(comment => comment.id.toString())
        .indexOf(req.params.comment_id);
      article.comments.splice(removedIndex, 1);
      await article.save();
      return res.status(200).json({
        status: 200,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Server error'
      });
    }
  }
}

export default CommentController;
