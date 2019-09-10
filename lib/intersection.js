/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const isArray = require('./isArray');
const forbidNewOperator = require('./isIdentity');
const is = require('./is');
const getTypeName = require('./getTypeName');
const isIdentity = require('./isIdentity');

function getDefaultName(types) {
  return types.map(getTypeName).join(' & ');
}

function intersection(types, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isArray(types) && types.every(isFunction) && types.length >= 2, function() {
      return `Invalid argument types ${assert.stringify(
        types,
      )} supplied to intersection(types, [name]) combinator (expected an array of at least 2 types)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to intersection(types, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(types);
  const identity = types.every(isIdentity);

  function Intersection(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      if (identity) {
        forbidNewOperator(this, Intersection);
      }
      path = path || [displayName];
      assert(Intersection.is(value), function() {
        return `Invalid value ${assert.stringify(value)} supplied to ${path.join('/')}`;
      });
    }

    return value;
  }

  Intersection.meta = {
    kind: 'intersection',
    types,
    name,
    identity,
  };

  Intersection.displayName = displayName;

  Intersection.is = function(x) {
    return types.every(function(type) {
      return is(x, type);
    });
  };

  Intersection.update = function(instance, patch) {
    return Intersection(assert.update(instance, patch));
  };

  return Intersection;
}

intersection.getDefaultName = getDefaultName;
module.exports = intersection;
/* eslint-enable */
