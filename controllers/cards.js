const Card = require('../models/card');
const { ERROR_BAD_REQUEST, NOT_FOUND_ERROR, ERROR_CODE } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card
    .create({ name, link, owner: _id })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card
    .findByIdAndRemove(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
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
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
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
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};
