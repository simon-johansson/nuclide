function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideFeatureConfig = require('../../nuclide-feature-config');

var _nuclideFeatureConfig2 = _interopRequireDefault(_nuclideFeatureConfig);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _nuclideRemoteConnection = require('../../nuclide-remote-connection');

function getDefaultFlags() {
  var config = _nuclideFeatureConfig2.default.get('nuclide-clang-atom');
  if (!config.enableDefaultFlags) {
    return null;
  }
  return config.defaultFlags;
}

module.exports = {

  getDiagnostics: _asyncToGenerator(function* (editor, clean) {
    var src = editor.getPath();
    var contents = editor.getText();

    var defaultFlags = getDefaultFlags();
    var service = (0, _nuclideRemoteConnection.getServiceByNuclideUri)('ClangService', src);
    (0, _assert2.default)(service);

    return service.compile(src, contents, clean, defaultFlags).toPromise();
  }),

  getCompletions: _asyncToGenerator(function* (editor, prefix) {
    var src = editor.getPath();
    var cursor = editor.getLastCursor();

    var line = cursor.getBufferRow();
    var column = cursor.getBufferColumn();
    var tokenStartColumn = column - prefix.length;

    var defaultFlags = getDefaultFlags();
    var service = (0, _nuclideRemoteConnection.getServiceByNuclideUri)('ClangService', src);
    (0, _assert2.default)(service);

    return service.getCompletions(src, editor.getText(), line, column, tokenStartColumn, prefix, defaultFlags);
  }),

  /**
   * If a location can be found for the declaration, it will be available via
   * the 'location' field on the returned object.
   */
  getDeclaration: _asyncToGenerator(function* (editor, line, column) {
    var src = editor.getPath();
    var defaultFlags = getDefaultFlags();

    var service = (0, _nuclideRemoteConnection.getServiceByNuclideUri)('ClangService', src);
    (0, _assert2.default)(service);

    return service.getDeclaration(src, editor.getText(), line, column, defaultFlags);
  }),

  getOutline: _asyncToGenerator(function* (editor) {
    var src = editor.getPath();
    var defaultFlags = getDefaultFlags();

    var service = (0, _nuclideRemoteConnection.getServiceByNuclideUri)('ClangService', src);
    (0, _assert2.default)(service);

    return service.getOutline(src, editor.getText(), defaultFlags);
  }),

  formatCode: function formatCode(editor, range) {
    var fileUri = editor.getPath();
    var buffer = editor.getBuffer();
    var cursor = buffer.characterIndexForPosition(editor.getLastCursor().getBufferPosition());
    var startIndex = buffer.characterIndexForPosition(range.start);
    var endIndex = buffer.characterIndexForPosition(range.end);

    var service = (0, _nuclideRemoteConnection.getServiceByNuclideUri)('ClangService', fileUri);
    (0, _assert2.default)(service);

    return service.formatCode(fileUri, editor.getText(), cursor, startIndex, endIndex - startIndex);
  },

  reset: function reset(editor) {
    var src = editor.getPath();
    if (src != null) {
      var service = (0, _nuclideRemoteConnection.getServiceByNuclideUri)('ClangService', src);
      (0, _assert2.default)(service);
      return service.reset(src);
    }
  }

};