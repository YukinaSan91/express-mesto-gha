/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const { REGEX_URL } = require('../utils/constants');

router.get('/users', getUsers);

router.get('/users/me', getUserById);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .required()
      .alphanum()
      .hex()
      .length(24),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REGEX_URL).required(),
  }),
}), updateUserAvatar);

module.exports = router;
