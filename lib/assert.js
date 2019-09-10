/* eslint-disable no-param-reassign */
const isFunction = require('./isFunction');
const isNil = require('./isNil');
const fail = require('./fail');
const stringify = require('./stringify');

/**
 * assert
 * @param {*} guard
 * @param {*} message
 */
function assert(guard, message) {
  if (guard !== true) {
    if (isFunction(message)) {
      // handle lazy messages
      message = message();
    } else if (isNil(message)) {
      // use a default message
      message = 'Assert failed (turn on "Pause on exceptions" in your Source panel)';
    }
    assert.fail(message);
  }
}

assert.fail = fail;
assert.stringify = stringify;

module.exports = assert;
