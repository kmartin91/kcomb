/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const forbidNewOperator = require('./forbidNewOperator');
const isNumber = require('./isNumber');
const isString = require('./isString');
const isObject = require('./isObject');

function getDefaultName(map) {
  return Object.keys(map)
    .map(function(k) {
      return assert.stringify(k);
    })
    .join(' | ');
}

function enums(map, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isObject(map), function() {
      return `Invalid argument map ${assert.stringify(
        map,
      )} supplied to enums(map, [name]) combinator (expected a dictionary of String -> String | Number)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to enums(map, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(map);

  function Enums(value, path) {
    if (process.env.NODE_ENV !== 'production') {
      forbidNewOperator(this, Enums);
      path = path || [displayName];
      assert(Enums.is(value), function() {
        return `Invalid value ${assert.stringify(
          value,
        )} supplied to ${path.join('/')} (expected one of ${assert.stringify(Object.keys(map))})`;
      });
    }

    return value;
  }

  Enums.meta = {
    kind: 'enums',
    map,
    name,
    identity: true,
  };

  Enums.displayName = displayName;

  Enums.is = function(x) {
    return (isString(x) || isNumber(x)) && map.hasOwnProperty(x);
  };

  return Enums;
}

enums.of = function(keys, name) {
  keys = isString(keys) ? keys.split(' ') : keys;
  const value = {};
  keys.forEach(function(k) {
    value[k] = k;
  });
  return enums(value, name);
};

enums.getDefaultName = getDefaultName;
module.exports = enums;
/* eslint-enable */
