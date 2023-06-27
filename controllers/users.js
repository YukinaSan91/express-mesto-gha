/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_OK } = require('../utils/constants');

const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => {
      res
        .status(STATUS_OK)
        .send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          },
        });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже существует'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};
