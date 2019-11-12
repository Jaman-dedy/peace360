import { validationResult } from 'express-validator';
import Profile from '../models/Profile';
import Article from '../models/Article';
import User from '../models/User';

class ProfileController {
  async currentUserProfile(req, res) {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name', 'avatar']
      );
      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
      }
      res.status(200).json({ status: 200, user });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: 500, msg: 'server error' });
    }
  }
  async createOrUpdateProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          { $set: profileFields },
          { new: true }
        );
        res.status(200).json({ status: 200, profile });
      }
      // create
      profile = new Profile(profileFields);
      await profile.save();
      res.status(201).json({ status: 201, profile });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ status: 500, msg: 'server error' });
    }
  }
  async followUser(req, res) {
    try {
      const currentArticle = await Article.findById(req.params.article_id);
      const user = currentArticle.user;
      const userToFollow = await Profile.findOne({ user });
      if (user == req.user.id) {
        return res.status(401).json({
          status: 401,
          msg: 'unauthorized action, you can not follow yourself'
        });
      }
      
      // if (
      //   userToFollow.following.filter(
      //     follow => follow.followBy.toString() === req.user.id
      //   ).length > 0
      // ) {
      //   const removeIndex = userToFollow.following
      //     .map(unfollow => unfollow.user.toString())
      //     .indexOf(req.user.id);

      //   userToFollow.following.splice(removeIndex, 1);
      //   await userToFollow.save();
      //   const unfollow = userToFollow.following;
      //   return res.status(200).json({
      //     status: 200,
      //     message: 'User unfollowed successfully',
      //     unfollow
      //   });
      // }
      // userToFollow.following.unshift({
      //   user,
      //   name: req.user.name,
      //   avatar: req.user.avatar,
      //   followBy: req.user.id
      // });
      // await userToFollow.save();
      // const follow = userToFollow.following;
      // res.status(200).json({
      //   status: 200,
      //   message: 'User followed successfully',
      //   follow
      // });
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
  async getFollowers(req, res) {
    try {
      const profile = await Profile.find();
      // const followers = profile.map(profile =>
      //   profile.following.filter(following => following.user == req.user.id)
      // );
      // let followerFound = followers.filter(data => data instanceof Object);
      // if (followers.includes(undefined) && !followerFound.length) {
      //   return res.status(404).json({
      //     status: 404,
      //     msg: "Oops, currently you don't have any follower"
      //   });
      // }
      // return res.status(200).json({
      //   status: 200,
      //   followers
      // });

    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
}
export default ProfileController;
