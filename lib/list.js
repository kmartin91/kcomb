/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const getTypeName = require('./getTypeName');
const isIdentity = require('./isIdentity');
const create = require('./create');
const is = require('./is');
const isArray = require('./isArray');

function getDefaultName(type) {
  return `Array<${getTypeName(type)}>`;
}

function list(type, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(type), function() {
      return `Invalid argument type ${assert.stringify(
        type,
      )} supplied to list(type, [name]) combinator (expected a type)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to list(type, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(type);
  const typeNameCache = getTypeName(type);
  const identity = isIdentity(type); // the list is identity iif type is identity

  function List(value, path) {
    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value; // just trust the input if elements must not be hydrated
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isArray(value), function() {
        return `Invalid value ${assert.stringify(
          value,
        )} supplied to ${path.join('/')} (expected an array of ${typeNameCache})`;
      });
    }

    let idempotent = true; // will remain true if I can reutilise the input
    let ret = []; // make a temporary copy, will be discarded if idempotent remains true
    for (let i = 0, len = value.length; i < len; i++) {
      const actual = value[i];
      const instance = create(
        type,
        actual,
        process.env.NODE_ENV !== 'production' ? path.concat(`${i}: ${typeNameCache}`) : null,
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

  List.meta = {
    kind: 'list',
    type,
    name,
    identity,
  };

  List.displayName = displayName;

  List.is = function(x) {
    return (
      isArray(x) &&
      x.every(function(e) {
        return is(e, type);
      })
    );
  };

  List.update = function(instance, patch) {
    return List(assert.update(instance, patch));
  };

  return List;
}

list.getDefaultName = getDefaultName;
module.exports = list;
/* eslint-enable */
