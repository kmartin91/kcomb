const getTypeName = require('./getTypeName');

/**
 * getDefault InterfaceName
 * @param {*} props
 */
function getDefaultInterfaceName(props) {
  return `{${Object.keys(props)
    .map(prop => `${prop}: ${getTypeName(props[prop])}`)
    .join(', ')}}`;
}

module.exports = getDefaultInterfaceName;
