'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {CompositeDisposable} from 'atom';

class Activation {
  _disposables: CompositeDisposable;

  constructor(state: ?Object) {
    // TODO(matthewwithanm): Assign all fields here so they are
    // non-nullable for the lifetime of Activation.
    this._disposables = new CompositeDisposable();
  }

  activate() {
    // TODO(matthewwithanm): Add activation code here.
  }

  dispose() {
    this._disposables.dispose();
  }
}

let activation: ?Activation = null;

export function activate(state: ?Object) {
  if (!activation) {
    activation = new Activation(state);
    activation.activate();
  }
}

export function deactivate() {
  if (activation) {
    activation.dispose();
    activation = null;
  }
}