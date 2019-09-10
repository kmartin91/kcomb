const irreducible = require('./irreducible');

module.exports = irreducible('Error', x => x instanceof Error);
