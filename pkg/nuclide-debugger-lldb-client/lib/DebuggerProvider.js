

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _LLDBLaunchAttachProvider = require('./LLDBLaunchAttachProvider');

function getLaunchAttachProvider(connection) {
  return new _LLDBLaunchAttachProvider.LLDBLaunchAttachProvider('Native', connection);
}

module.exports = {
  name: 'lldb',
  getLaunchAttachProvider: getLaunchAttachProvider
};