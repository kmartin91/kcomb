/* eslint-disable */
const assert = require('./assert');
const isTypeName = require('./isTypeName');
const String = require('./String');
const Function = require('./Function');
const isBoolean = require('./isBoolean');
const isObject = require('./isObject');
const isNil = require('./isNil');
const create = require('./create');
const getTypeName = require('./getTypeName');
const dict = require('./dict');
const getDefaultInterfaceName = require('./getDefaultInterfaceName');
const extend = require('./extend');

function getDefaultName(props) {
  return `Struct${getDefaultInterfaceName(props)}`;
}

function extendStruct(mixins, name) {
  return extend(struct, mixins, name);
}

function getOptions(options) {
  if (!isObject(options)) {
    options = isNil(options) ? {} : { name: options };
  }
  if (!options.hasOwnProperty('strict')) {
    options.strict = struct.strict;
  }
  if (!options.hasOwnProperty('defaultProps')) {
    options.defaultProps = {};
  }
  return options;
}

function struct(props, options) {
  options = getOptions(options);
  const { name } = options;
  const { strict } = options;
  const { defaultProps } = options;

  if (process.env.NODE_ENV !== 'production') {
    assert(dict(String, Function).is(props), function() {
      return `Invalid argument props ${assert.stringify(
        props,
      )} supplied to struct(props, [options]) combinator (expected a dictionary String -> Type)`;
    });
    assert(isTypeName(name), function() {
      return `Invalid argument name ${assert.stringify(
        name,
      )} supplied to struct(props, [options]) combinator (expected a string)`;
    });
    assert(isBoolean(strict), function() {
      return `Invalid argument strict ${assert.stringify(
        strict,
      )} supplied to struct(props, [options]) combinator (expected a boolean)`;
    });
    assert(isObject(defaultProps), function() {
      return `Invalid argument defaultProps ${assert.stringify(
        defaultProps,
      )} supplied to struct(props, [options]) combinator (expected an object)`;
    });
  }

  const displayName = name || getDefaultName(props);

  function Struct(value, path) {
    if (Struct.is(value)) {
      // implements idempotency
      return value;
    }

    if (process.env.NODE_ENV !== 'production') {
      path = path || [displayName];
      assert(isObject(value), function() {
        return `Invalid value ${assert.stringify(
          value,
        )} supplied to ${path.join('/')} (expected an object)`;
      });
      // strictness
      if (strict) {
        for (k in value) {
          if (value.hasOwnProperty(k)) {
            assert(props.hasOwnProperty(k), function() {
              return `Invalid additional prop "${k}" supplied to ${path.join('/')}`;
            });
          }
        }
      }
    }

    if (!(this instanceof Struct)) {
      // `new` is optional
      return new Struct(value, path);
    }

    for (var k in props) {
      if (props.hasOwnProperty(k)) {
        const expected = props[k];
        let actual = value[k];
        // apply defaults
        if (actual === undefined) {
          actual = defaultProps[k];
        }
        this[k] = create(
          expected,
          actual,
          process.env.NODE_ENV !== 'production'
            ? path.concat(`${k}: ${getTypeName(expected)}`)
            : null,
        );
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(this);
    }
  }

  Struct.meta = {
    kind: 'struct',
    props,
    name,
    identity: false,
    strict,
    defaultProps,
  };

  Struct.displayName = displayName;

  Struct.is = function(x) {
    return x instanceof Struct;
  };

  Struct.update = function(instance, patch) {
    return new Struct(assert.update(instance, patch));
  };

  Struct.extend = function(xs, name) {
    return extendStruct([Struct].concat(xs), name);
  };

  return Struct;
}

struct.strict = false;
struct.getOptions = getOptions;
struct.getDefaultName = getDefaultName;
struct.extend = extendStruct;
module.exports = struct;
/* eslint-enable */
