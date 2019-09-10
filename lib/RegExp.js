const irreducible = require('./irreducible');

module.exports = irreducible('RegExp', x => x instanceof RegExp);
