import { validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import generateToken from '../helpers/generateToken';
import User from '../models/User';
import sendEmail from '../helpers/sendEmail/callMailer';
import jwt from 'jsonwebtoken';
import config from 'config';

class UserController {
  async signup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, country, organisation, category } = req.body;

    const avatar = gravatar.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });
    let user = new User({
      name,
      email,
      avatar,
      password,
      country,
      organisation,
      category
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    };
    const token = generateToken(payload);
    res.status(201).json({ status: 201, user, token });
  }
  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    };

    const token = generateToken(payload);
    res.status(200).json({ status: 200, user, token });
  }

  async checkEmail(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 404,
          msg: 'No user found with that email address'
        });
      }
      const payload = {
        email: user.email
      };
      const token = generateToken(payload);
      req.body.token = token;
      req.body.template = 'resetPassword';
      const response = await sendEmail(user.email, token, 'resetPassword');
      res.status(200).send({ status: 200, response });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
  async resetPassword(req, res) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const { token } = req.body;
    const decoded = jwt.decode(token, config.get('jwtSecret'));
    try {
      if (!decoded) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid token'
        });
      }
      const updatePwd = await User.findOneAndUpdate(
        { email: decoded.email },
        { password }
      );
      if (updatePwd) {
        return res.status(200).json({
          status: 200,
          message: "Congratulations! You've successfully reset your password"
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
  async getAuthenticatedUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json({ status: 200, user });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: 500, msg: 'server error' });
    }
  }
}
export default UserController;
