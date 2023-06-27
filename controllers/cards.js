/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const Card = require('../models/card');
const { STATUS_OK, STATUS_CODE } = require('../utils/constants');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card
    .create({ name, link, owner: _id })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав доступа');
      }
      Card
        .findByIdAndRemove(cardId)
      // eslint-disable-next-line consistent-return
        .then((card) => {
          if (!card) {
            throw new NotFoundError('Карточка не найдена');
          }
          res.status(STATUS_CODE).send({ data: card });
        })
      // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new ValidationError('Переданы некорректные данные'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(STATUS_OK).send({ data: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(STATUS_CODE).send({ data: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
