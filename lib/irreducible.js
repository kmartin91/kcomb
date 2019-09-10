/* eslint-disable */
const assert = require('./assert');
const isString = require('./isString');
const isFunction = require('./isFunction');
const forbidNewOperator = require('./forbidNewOperator');

module.exports = function irreducible(name, predicate) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isString(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to irreducible(name, predicate) (expected a string)`;
    });
    assert(
      isFunction(predicate),
      `Invalid argument predicate ${assert.stringify(
        predicate,
      )} supplied to irreducible(name, predicate) (expected a function)`,
    );
  }

  function Irreducible(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Irreducible);
      path = path || [name];
      assert(predicate(value), function() {
        return `Invalid value ${assert.stringify(value)} supplied to ${path.join('/')}`;
      });
    }

    return value;
  }

  Irreducible.meta = {
    kind: 'irreducible',
    name,
    predicate,
    identity: true,
  };

  Irreducible.displayName = name;

  Irreducible.is = predicate;

  return Irreducible;
};
/* eslint-enable */
