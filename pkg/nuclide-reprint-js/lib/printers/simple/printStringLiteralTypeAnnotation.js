function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _utilsEscapeStringLiteral = require('../../utils/escapeStringLiteral');

var _utilsEscapeStringLiteral2 = _interopRequireDefault(_utilsEscapeStringLiteral);

function printStringLiteralTypeAnnotation(print, node) {
  return [(0, _utilsEscapeStringLiteral2.default)(node.value, { quotes: 'single' })];
}

module.exports = printStringLiteralTypeAnnotation;