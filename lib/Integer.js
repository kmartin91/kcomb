const refinement = require('./refinement');
const Number = require('./Number');

module.exports = refinement(Number, x => x % 1 === 0, 'Integer');
