/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const forbidNewOperator = require('./forbidNewOperator');
const isIdentity = require('./isIdentity');
const create = require('./create');
const is = require('./is');
const getTypeName = require('./getTypeName');
const getFunctionName = require('./getFunctionName');

function getDefaultName(type, predicate) {
  return `{${getTypeName(type)} | ${getFunctionName(predicate)}}`;
}

function refinement(type, predicate, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function() {
      return `Invalid argument type ${assert.stringify(
        type,
      )} supplied to refinement(type, predicate, [name]) combinator (expected a type)`;
    });
    assert(isFunction(predicate), function() {
      return 'Invalid argument predicate supplied to refinement(type, predicate, [name]) combinator (expected a function)';
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to refinement(type, predicate, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(type, predicate);
  const identity = isIdentity(type);

  function Refinement(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      if (identity) {
        forbidNewOperator(this, Refinement);
      }
      path = path || [displayName];
    }

    const x = create(type, value, path);

    if (process.env.NODE_ENV !== 'production') {
      assert(predicate(x), function() {
        return `Invalid value ${assert.stringify(value)} supplied to ${path.join('/')}`;
      });
    }

    return x;
  }

  Refinement.meta = {
    kind: 'subtype',
    type,
    predicate,
    name,
    identity,
  };

  Refinement.displayName = displayName;

  Refinement.is = function(x) {
    return is(x, type) && predicate(x);
  };

  Refinement.update = function(instance, patch) {
    return Refinement(assert.update(instance, patch));
  };

  return Refinement;
}

refinement.getDefaultName = getDefaultName;
module.exports = refinement;
/* eslint-enable */
