const getFunctionName = require('./getFunctionName');

/**
 * Replacer
 * @param {*} key
 * @param {*} value
 */
function replacer(key, value) {
  if (typeof value === 'function') {
    return getFunctionName(value);
  }
  return value;
}

module.exports = function stringify(x) {
  try {
    // handle "Converting circular structure to JSON" error
    return JSON.stringify(x, replacer, 2);
  } catch (e) {
    return String(x);
  }
};
