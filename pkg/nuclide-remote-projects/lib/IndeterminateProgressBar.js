'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {React} from 'react-for-atom';

/**
 * Component to entertain the user while he is waiting to hear back from the server.
 */
export default class IndeterminateProgressBar extends React.Component {
  render(): React.Element {
    return (
      <div className="text-center padded">
        <span className="loading loading-spinner-medium inline-block"></span>
      </div>
    );
  }
}
