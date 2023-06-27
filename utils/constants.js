/* eslint-disable no-useless-escape */
const VALIDATION_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND_ERROR = 404;
const CONFLICT_ERROR = 409;
const SERVER_ERROR = 500;
const STATUS_CODE = 200;
const STATUS_OK = 201;

const REGEX_URL = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,6}([\/\?\#][^\s]*)?$/;

module.exports = {
  VALIDATION_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  SERVER_ERROR,
  STATUS_CODE,
  STATUS_OK,
  REGEX_URL,
};
