/**
 * Assign
 * @param {*} x
 * @param {*} y
 */
function assign(x, y) {
  const w = x;
  Object.keys(y).forEach(k => {
    w[k] = y[k];
  });
  return w;
}

module.exports = assign;
