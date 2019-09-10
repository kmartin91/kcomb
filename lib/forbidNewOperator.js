const assert = require('./assert');
const getTypeName = require('./getTypeName');

module.exports = function forbidNewOperator(x, type) {
  assert(
    !(x instanceof type),
    () => `Cannot use the new operator to instantiate the type ${getTypeName(type)}`,
  );
};
