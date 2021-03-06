'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {NuclideUri} from '../../nuclide-remote-uri';

import path from 'path';
import {asyncExecute} from '../../commons-node/process';
import {getPath} from '../../nuclide-remote-uri';
import LRUCache from 'lru-cache';
import JediServer from './JediServer';

export type JediCompletion = {
  type: string;
  text: string;
  description?: string;
  params?: Array<string>;
};

export type JediCompletionsResult = {
  completions: Array<JediCompletion>;
};

export type JediDefinition = {
  type: string;
  text: string;
  file: NuclideUri;
  line: number;
  column: number;
};

export type JediDefinitionsResult = {
  definitions: Array<JediDefinition>;
};

export type JediReference = {
  type: string;
  text: string;
  file: NuclideUri;
  line: number;
  column: number;
  parentName?: string;
};

export type JediReferencesResult = {
  references: Array<JediReference>;
};

export type Position = {
  line: number;
  column: number;
};

export type JediFunctionItem = {
  kind: 'function';
  name: string;
  start: Position;
  end: Position;
  children?: Array<JediOutlineItem>;
  docblock?: string;
  params?: Array<string>;
};

export type JediClassItem = {
  kind: 'class';
  name: string;
  start: Position;
  end: Position;
  children?: Array<JediOutlineItem>;
  docblock?: string;
  // Class params, i.e. superclasses.
  params?: Array<string>;
};

export type JediStatementItem = {
  kind: 'statement';
  name: string;
  start: Position;
  end: Position;
  docblock?: string;
};

export type JediOutlineItem = JediFunctionItem | JediClassItem | JediStatementItem;

export type JediOutlineResult = {
  items: Array<JediOutlineItem>
};

// Limit the number of active Jedi processes.
const jediServers = new LRUCache({
  max: 10,
  dispose(key: NuclideUri, val: JediServer) {
    val.dispose();
  },
});

// Cache the pythonPath on first execution so we don't rerun overrides script
// everytime.
let pythonPath;
async function getPythonPath() {
  if (pythonPath) {
    return pythonPath;
  }
  // Default to assuming that python is in system PATH.
  pythonPath = 'python';
  try {
    // Override the python path if override script is present.
    // $FlowFB
    const overrides = await require('./fb/find-jedi-server-args')();
    if (overrides.pythonExecutable) {
      pythonPath = overrides.pythonExecutable;
    }
  } catch (e) {
    // Ignore.
  }
  return pythonPath;
}

let formatterPath;
function getFormatterPath() {
  if (formatterPath) {
    return formatterPath;
  }

  formatterPath = 'yapf';

  try {
    const overridePath = require('./fb/find-formatter-path')();
    if (overridePath) {
      formatterPath = overridePath;
    }
  } catch (e) {
    // Ignore.
  }

  return formatterPath;
}

async function getJediServer(src: NuclideUri): Promise<JediServer> {
  let server = jediServers.get(src);
  if (server != null) {
    return server;
  }
  // Create a JediServer using default python path.
  server = new JediServer(src, await getPythonPath());
  jediServers.set(src, server);
  return server;
}

export async function getCompletions(
  src: NuclideUri,
  contents: string,
  line: number,
  column: number,
): Promise<?JediCompletionsResult> {
  const server = await getJediServer(src);
  return server.call(
    'get_completions',
    {
      src,
      contents,
      line,
      column,
    });
}

export async function getDefinitions(
  src: NuclideUri,
  contents: string,
  line: number,
  column: number,
): Promise<?JediDefinitionsResult> {
  const server = await getJediServer(src);
  return server.call(
    'get_definitions',
    {
      src,
      contents,
      line,
      column,
    });
}

export async function getReferences(
  src: NuclideUri,
  contents: string,
  line: number,
  column: number,
): Promise<?JediReferencesResult> {
  const server = await getJediServer(src);
  return server.call(
    'get_references',
    {
      src,
      contents,
      line,
      column,
    });
}

export async function getOutline(
  src: NuclideUri,
  contents: string,
): Promise<?JediOutlineResult> {
  const server = await getJediServer(src);
  return server.call('get_outline', {src, contents});
}

export async function formatCode(
  src: NuclideUri,
  contents: string,
  start: number,
  end: number,
): Promise<string> {
  const libCommand = getFormatterPath();
  const dirName = path.dirname(getPath(src));

  const result = await asyncExecute(
    libCommand,
    ['--line', `${start}-${end}`],
    {cwd: dirName, stdin: contents},
  );

  /*
   * At the moment, yapf outputs 3 possible exit codes:
   * 0 - success, no content change.
   * 2 - success, contents changed.
   * 1 - internal failure, most likely due to syntax errors.
   *
   * See: https://github.com/google/yapf/issues/228#issuecomment-198682079
   */
  if (result.exitCode === 1) {
    throw new Error(`"${libCommand}" failed, likely due to syntax errors.`);
  } else if (result.exitCode == null) {
    throw new Error(
      `"${libCommand}" failed with error: ${result.errorMessage}, ` +
      `stderr: ${result.stderr}, stdout: ${result.stdout}.`
    );
  } else if (contents !== '' && result.stdout === '') {
    // Throw error if the yapf output is empty, which is almost never desirable.
    throw new Error('Empty output received from yapf.');
  }

  return result.stdout;
}
