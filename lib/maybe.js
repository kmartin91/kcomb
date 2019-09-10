/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const isMaybe = require('./isMaybe');
const isIdentity = require('./isIdentity');
const Any = require('./Any');
const create = require('./create');
const Nil = require('./Nil');
const forbidNewOperator = require('./forbidNewOperator');
const is = require('./is');
const getTypeName = require('./getTypeName');

function getDefaultName(type) {
  return `?${getTypeName(type)}`;
}

function maybe(type, name) {
  if (isMaybe(type) || type === Any || type === Nil) {
    // makes the combinator idempotent and handle Any, Nil
    return type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function() {
      return `Invalid argument type ${assert.stringify(
        type,
      )} supplied to maybe(type, [name]) combinator (expected a type)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to maybe(type, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(type);
  const identity = isIdentity(type);

  function Maybe(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      if (identity) {
        forbidNewOperator(this, Maybe);
      }
    }
    return Nil.is(value) ? value : create(type, value, path);
  }

  Maybe.meta = {
    kind: 'maybe',
    type,
    name,
    identity,
  };

  Maybe.displayName = displayName;

  Maybe.is = function(x) {
    return Nil.is(x) || is(x, type);
  };

  return Maybe;
}

maybe.getDefaultName = getDefaultName;
module.exports = maybe;
/* eslint-enable */
