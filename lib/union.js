/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const getTypeName = require('./getTypeName');
const isIdentity = require('./isIdentity');
const isArray = require('./isArray');
const create = require('./create');
const is = require('./is');
const forbidNewOperator = require('./forbidNewOperator');
const isUnion = require('./isUnion');
const isNil = require('./isNil');

function getDefaultName(types) {
  return types.map(getTypeName).join(' | ');
}

function union(types, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function() {
      return `Invalid argument types ${assert.stringify(
        types,
      )} supplied to union(types, [name]) combinator (expected an array of at least 2 types)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to union(types, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(types);
  const identity = types.every(isIdentity);

  function Union(value, path) {
    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value;
      }
    }

    const type = Union.dispatch(value);
    if (!type && Union.is(value)) {
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (identity) {
        forbidNewOperator(this, Union);
      }
      path = path || [displayName];
      assert(isFunction(type), function() {
        return `Invalid value ${assert.stringify(
          value,
        )} supplied to ${path.join('/')} (no constructor returned by dispatch)`;
      });
      path[path.length - 1] += `(${getTypeName(type)})`;
    }

    return create(type, value, path);
  }

  Union.meta = {
    kind: 'union',
    types,
    name,
    identity,
  };

  Union.displayName = displayName;

  Union.is = function(x) {
    return types.some(function(type) {
      return is(x, type);
    });
  };

  Union.dispatch = function(x) {
    // default dispatch implementation
    for (let i = 0, len = types.length; i < len; i++) {
      const type = types[i];
      if (isUnion(type)) {
        // handle union of unions
        const t = type.dispatch(x);
        if (!isNil(t)) {
          return t;
        }
      } else if (is(x, type)) {
        return type;
      }
    }
  };

  Union.update = function(instance, patch) {
    return Union(assert.update(instance, patch));
  };

  return Union;
}

union.getDefaultName = getDefaultName;
module.exports = union;
/* eslint-enable */
