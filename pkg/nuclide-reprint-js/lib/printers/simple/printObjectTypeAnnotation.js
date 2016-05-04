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

function printObjectTypeAnnotation(print, node) {
  return (0, _utilsFlatten2.default)(['{', _constantsMarkers2.default.openScope, _constantsMarkers2.default.scopeIndent, _constantsMarkers2.default.scopeBreak, node.properties.map(function (p, i, arr) {
    return [print(p), i === arr.length - 1 ? _constantsMarkers2.default.scopeComma : ',', i === arr.length - 1 ? _constantsMarkers2.default.scopeBreak : _constantsMarkers2.default.scopeSpaceBreak];
  }), _constantsMarkers2.default.scopeDedent, _constantsMarkers2.default.closeScope, '}']);
}

module.exports = printObjectTypeAnnotation;