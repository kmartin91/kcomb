/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const isFunction = require('./isFunction');
const getTypeName = require('./getTypeName');
const isIdentity = require('./isIdentity');
const isObject = require('./isObject');
const create = require('./create');
const is = require('./is');

function getDefaultName(domain, codomain) {
  return `{[key: ${getTypeName(domain)}]: ${getTypeName(codomain)}}`;
}

function dict(domain, codomain, name) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(domain), function() {
      return `Invalid argument domain ${assert.stringify(
        domain,
      )} supplied to dict(domain, codomain, [name]) combinator (expected a type)`;
    });
    assert(isFunction(codomain), function() {
      return `Invalid argument codomain ${assert.stringify(
        codomain,
      )} supplied to dict(domain, codomain, [name]) combinator (expected a type)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to dict(domain, codomain, [name]) combinator (expected a string)`;
    });
  }

  const displayName = name || getDefaultName(domain, codomain);
  const domainNameCache = getTypeName(domain);
  const codomainNameCache = getTypeName(codomain);
  const identity = isIdentity(domain) && isIdentity(codomain);

  function Dict(value, path) {
    if (process.env.NODE_ENV === 'production') {
      if (identity) {
        return value; // just trust the input if elements must not be hydrated
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isObject(value), function() {
        return `Invalid value ${assert.stringify(value)} supplied to ${path.join('/')}`;
      });
    }

    let idempotent = true; // will remain true if I can reutilise the input
    let ret = {}; // make a temporary copy, will be discarded if idempotent remains true
    for (let k in value) {
      if (value.hasOwnProperty(k)) {
        k = create(
          domain,
          k,
          process.env.NODE_ENV !== 'production' ? path.concat(domainNameCache) : null,
        );
        const actual = value[k];
        const instance = create(
          codomain,
          actual,
          process.env.NODE_ENV !== 'production' ? path.concat(`${k}: ${codomainNameCache}`) : null,
        );
        idempotent = idempotent && actual === instance;
        ret[k] = instance;
      }
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

  Dict.meta = {
    kind: 'dict',
    domain,
    codomain,
    name,
    identity,
  };

  Dict.displayName = displayName;

  Dict.is = function(x) {
    if (!isObject(x)) {
      return false;
    }
    for (const k in x) {
      if (x.hasOwnProperty(k)) {
        if (!is(k, domain) || !is(x[k], codomain)) {
          return false;
        }
      }
    }
    return true;
  };

  Dict.update = function(instance, patch) {
    return Dict(assert.update(instance, patch));
  };

  return Dict;
}

dict.getDefaultName = getDefaultName;
module.exports = dict;
/* eslint-enable */
