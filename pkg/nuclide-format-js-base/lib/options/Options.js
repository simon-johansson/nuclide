function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideRemoteUri = require('../../../nuclide-remote-uri');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

/**
 * Valides the options used to construct a module map.
 */
function validateModuleMapOptions(options) {
  (0, _assert2.default)(options, 'Invalid (undefined) ModuleMapOptions given.');

  // Validate presence of correct fields.
  (0, _assert2.default)(options.paths, '`paths` must be provided.');
  (0, _assert2.default)(options.pathsToRelativize, '`pathsToRelativze` must be provided.');
  (0, _assert2.default)(options.aliases, '`aliases` must be provided.');
  (0, _assert2.default)(options.aliasesToRelativize, '`aliasesToRelativze` must be provided.');
  (0, _assert2.default)(options.builtIns, '`builtIns` must be provided.');
  (0, _assert2.default)(options.builtInTypes, '`builtInTypes` must be provided.');

  // TODO: Use let.
  var filePath = undefined;
  for (filePath of options.paths) {
    (0, _assert2.default)(isAbsolute(filePath), 'All paths must be absolute.');
  }
  for (filePath of options.pathsToRelativize) {
    (0, _assert2.default)(isAbsolute(filePath), 'All paths must be absolute.');
  }
}

/**
 * Valides the options used to get requires out of a module map.
 */
function validateRequireOptions(options) {
  (0, _assert2.default)(options, 'Invalid (undefined) RequireOptions given.');
}

/**
 * Validates the options given as input to transform.
 */
function validateSourceOptions(options) {
  (0, _assert2.default)(options, 'Invalid (undefined) SourceOptions given.');
  if (options.sourcePath != null) {
    (0, _assert2.default)(isAbsolute(options.sourcePath), 'If a "sourcePath" is given it must be an absolute path.');
  }
  (0, _assert2.default)(options.moduleMap, 'A "moduleMap" must be provided in order to transform the source.');
}

/**
 * Small helper function to validate that a path is absolute. We also need to
 * allow remote nuclide files.
 */
function isAbsolute(sourcePath) {
  return _path2.default.isAbsolute((0, _nuclideRemoteUri.getPath)(sourcePath));
}

var Options = {
  validateModuleMapOptions: validateModuleMapOptions,
  validateRequireOptions: validateRequireOptions,
  validateSourceOptions: validateSourceOptions
};

module.exports = Options;