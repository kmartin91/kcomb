const assert = require('./assert');
const Boolean = require('./Boolean');
const isType = require('./isType');
const getTypeName = require('./getTypeName');

// return true if the type constructor behaves like the identity function
module.exports = function isIdentity(type) {
  if (isType(type)) {
    if (process.env.NODE_ENV !== 'production') {
      assert(
        Boolean.is(type.meta.identity),
        () =>
          `Invalid meta identity ${assert.stringify(
            type.meta.identity,
          )} supplied to type ${getTypeName(type)}`,
      );
    }
    return type.meta.identity;
  }
  // for tcomb the other constructors, like ES6 classes, are identity-like
  return true;
};
