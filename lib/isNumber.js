module.exports = function isNumber(x) {
  return typeof x === 'number' && Number.isFinite(x) && !Number.isNaN(x);
};
