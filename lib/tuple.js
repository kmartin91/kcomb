/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const getTypeName = require('./getTypeName');
const isIdentity = require('./isIdentity');
const isArray = require('./isArray');
const create = require('./create');
const is = require('./is');

function getDefaultName(types) {
  return `[${types.map(getTypeName).join(', ')}]`;
}

function tuple(types, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction), function() {
      return `Invalid argument types ${assert.stringify(
        types,
      )} supplied to tuple(types, [name]) combinator (expected an array of types)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to tuple(types, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(types);
  const identity = types.every(isIdentity);

  function Tuple(value, path) {
    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isArray(value) && value.length === types.length, function() {
        return `Invalid value ${assert.stringify(
          value,
        )} supplied to ${path.join('/')} (expected an array of length ${types.length})`;
      });
    }

    let idempotent = true;
    let ret = [];
    for (let i = 0, len = types.length; i < len; i++) {
      const expected = types[i];
      const actual = value[i];
      const instance = create(
        expected,
        actual,
        process.env.NODE_ENV !== 'production'
          ? path.concat(`${i}: ${getTypeName(expected)}`)
          : null,
      );
      idempotent = idempotent && actual === instance;
      ret.push(instance);
    }

    if (idempotent) {
      // implements idempotency
      ret = value;
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(ret);
    }

    return ret;
  }

  Tuple.meta = {
    kind: 'tuple',
    types,
    name,
    identity,
  };

  Tuple.displayName = displayName;

  Tuple.is = function(x) {
    return (
      isArray(x) &&
      x.length === types.length &&
      types.every(function(type, i) {
        return is(x[i], type);
      })
    );
  };

  Tuple.update = function(instance, patch) {
    return Tuple(assert.update(instance, patch));
  };

  return Tuple;
}

tuple.getDefaultName = getDefaultName;
module.exports = tuple;
/* eslint-enable */
