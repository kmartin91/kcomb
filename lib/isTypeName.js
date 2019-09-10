const isNil = require('./isNil');
const isString = require('./isString');

module.exports = function isTypeName(name) {
  return isNil(name) || isString(name);
};
