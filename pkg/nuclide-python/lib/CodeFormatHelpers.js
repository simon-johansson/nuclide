'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {trackTiming} from '../../nuclide-analytics';
import {getServiceByNuclideUri} from '../../nuclide-remote-connection';
import invariant from 'assert';

export default class CodeFormatHelpers {

  @trackTiming('python.formatCode')
  static async formatEntireFile(editor: atom$TextEditor, range: atom$Range): Promise<{
    newCursor?: number;
    formatted: string;
  }> {
    const buffer = editor.getBuffer();
    const src = editor.getPath();
    if (!src) {
      return {
        formatted: buffer.getTextInRange(range),
      };
    }

    const service = getServiceByNuclideUri('JediService', src);
    invariant(service, 'Failed to get service for python.');

    try {
      const formatted = await service.formatCode(
        src,
        buffer.getText(),
        range.start.row + 1,
        range.end.row + 1
      );

      return {formatted};
    } catch (e) {
      atom.notifications.addError('Failed to format code. Error: ' + e.message);
      return {
        formatted: buffer.getTextInRange(range),
      };
    }
  }

}
