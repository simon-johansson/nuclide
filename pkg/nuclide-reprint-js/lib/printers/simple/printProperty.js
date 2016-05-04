function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _utilsFlatten = require('../../utils/flatten');

var _utilsFlatten2 = _interopRequireDefault(_utilsFlatten);

var _constantsMarkers = require('../../constants/markers');

var _constantsMarkers2 = _interopRequireDefault(_constantsMarkers);

function printProperty(print, node) {
  var parts = [];

  if (node.kind === 'get') {
    parts = parts.concat(['get', _constantsMarkers2.default.noBreak, _constantsMarkers2.default.space]);
  } else if (node.kind === 'set') {
    parts = parts.concat(['set', _constantsMarkers2.default.noBreak, _constantsMarkers2.default.space]);
  }

  if (node.value && node.value.async) {
    parts = parts.concat(['async', _constantsMarkers2.default.noBreak, _constantsMarkers2.default.space]);
  }

  if (node.value && node.value.generator) {
    parts = parts.concat(['*', _constantsMarkers2.default.noBreak]);
  }

  if (node.computed) {
    parts = parts.concat(['[', _constantsMarkers2.default.noBreak, print(node.key), _constantsMarkers2.default.noBreak, ']', _constantsMarkers2.default.noBreak]);
  } else {
    parts = parts.concat([print(node.key), _constantsMarkers2.default.noBreak]);
  }

  // TODO: Force the scope to break when a property is a method. Or if the
  // value is a function expression.
  if (node.method) {
    parts = parts.concat([_constantsMarkers2.default.noBreak, print(node.value)]);
  } else if (!node.shorthand) {
    parts = parts.concat([':', _constantsMarkers2.default.noBreak, _constantsMarkers2.default.space, print(node.value)]);
  } else if (node.key.type !== node.value.type) {
    // This is a very strange case in the AST where we are in a shorthand
    // property but key and value do not have the same type. This can happen
    // when using defaults in an object pattern. E.g:
    //
    //   var {x = 4} = a;
    //
    // x is shorthand but its value is an assignment expression. In this case
    // we will just print the value.
    parts = [print(node.value)];
  }

  return (0, _utilsFlatten2.default)(parts);
}

module.exports = printProperty;