/* eslint-disable */
const assert = require('./assert');
const isFunction = require('./isFunction');
const isArray = require('./isArray');
const mixin = require('./mixin');
const isStruct = require('./isStruct');
const isInterface = require('./isInterface');
const isObject = require('./isObject');
const refinement = require('./refinement');
const decompose = require('./decompose');

function compose(predicates, unrefinedType, name) {
  const result = predicates.reduce(function(type, predicate) {
    return refinement(type, predicate);
  }, unrefinedType);
  if (name) {
    result.displayName = name;
    result.meta.name = name;
  }
  return result;
}

function getProps(type) {
  return isObject(type) ? type : type.meta.props;
}

function getDefaultProps(type) {
  return isObject(type) ? null : type.meta.defaultProps;
}

function pushAll(arr, elements) {
  Array.prototype.push.apply(arr, elements);
}

function extend(combinator, mixins, options) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isFunction(combinator), function() {
      return 'Invalid argument combinator supplied to extend(combinator, mixins, options), expected a function';
    });
    assert(isArray(mixins), function() {
      return 'Invalid argument mixins supplied to extend(combinator, mixins, options), expected an array';
    });
  }
  const props = {};
  const prototype = {};
  const predicates = [];
  const defaultProps = {};
  mixins.forEach(function(x, i) {
    const decomposition = decompose(x);
    const { unrefinedType } = decomposition;
    if (process.env.NODE_ENV !== 'production') {
      assert(
        isObject(unrefinedType) || isStruct(unrefinedType) || isInterface(unrefinedType),
        function() {
          return `Invalid argument mixins[${i}] supplied to extend(combinator, mixins, options), expected an object, struct, interface or a refinement (of struct or interface)`;
        },
      );
    }
    pushAll(predicates, decomposition.predicates);
    mixin(props, getProps(unrefinedType));
    mixin(prototype, unrefinedType.prototype);
    mixin(defaultProps, getDefaultProps(unrefinedType), true);
  });
  options = combinator.getOptions(options);
  options.defaultProps = mixin(defaultProps, options.defaultProps, true);
  const result = compose(
    predicates,
    combinator(props, {
      strict: options.strict,
      defaultProps: options.defaultProps,
    }),
    options.name,
  );
  mixin(result.prototype, prototype);
  return result;
}

module.exports = extend;
/* eslint-enable */
