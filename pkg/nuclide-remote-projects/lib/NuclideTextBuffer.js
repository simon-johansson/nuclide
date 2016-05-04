var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _nuclideLogging = require('../../nuclide-logging');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _atom = require('atom');

var _nuclideAnalytics = require('../../nuclide-analytics');

var logger = (0, _nuclideLogging.getLogger)();

// Do not attempt to diff files larger than this limit.
var DIFF_FILE_SIZE_LIMIT = 10000;

var NuclideTextBuffer = (function (_TextBuffer) {
  _inherits(NuclideTextBuffer, _TextBuffer);

  function NuclideTextBuffer(connection, params) {
    _classCallCheck(this, NuclideTextBuffer);

    _get(Object.getPrototypeOf(NuclideTextBuffer.prototype), 'constructor', this).call(this, params);
    this._exists = true;
    this._connection = connection;
    this._saveID = 0;
    this.setPath(params.filePath);
    var encoding = atom.config.get('core.fileEncoding');
    this.setEncoding(encoding);
  }

  // Atom 1.4.0+ serializes TextBuffers with the ID generated by `getId`. When
  // a buffer is deserialized, it is looked up in the buffer cache by this key.
  // The logic there is setup to create a new buffer when there is a cache miss.
  // However, when there is no key, it's not looked up in cache, but rather by
  // its path. This behavior ensures that when a connection is reestablished,
  // a buffer exists with that path. See https://github.com/atom/atom/pull/9968.

  _createClass(NuclideTextBuffer, [{
    key: 'getId',
    value: function getId() {
      return '';
    }
  }, {
    key: 'setPath',
    value: function setPath(filePath) {
      if (!this._connection) {
        // If this._connection is not set, then the superclass constructor is still executing.
        // NuclideTextBuffer's constructor will ensure setPath() is called once this.constructor
        // is set.
        return;
      }
      if (filePath === this.getPath()) {
        return;
      }
      if (filePath) {
        this.file = this.createFile(filePath);
        if (this.file !== null) {
          var file = this.file;
          file.setEncoding(this.getEncoding());
          this.subscribeToFile();
        }
      } else {
        this.file = null;
      }
      this.emitter.emit('did-change-path', this.getPath());
    }
  }, {
    key: 'createFile',
    value: function createFile(filePath) {
      return this._connection.createFile(filePath);
    }
  }, {
    key: 'saveAs',
    value: _asyncToGenerator(function* (filePath) {
      if (!filePath) {
        throw new Error('Can\'t save buffer with no file path');
      }

      var success = undefined;
      this.emitter.emit('will-save', { path: filePath });
      this.setPath(filePath);
      var toSaveContents = this.getText();
      try {
        var file = this.file;
        (0, _assert2.default)(file, 'Cannot save an null file!');
        yield file.write(toSaveContents);
        this.cachedDiskContents = toSaveContents;
        this._saveID++;
        this.conflict = false;
        this.emitModifiedStatusChanged(false);
        this.emitter.emit('did-save', { path: filePath });
        success = true;
      } catch (e) {
        // Timeouts occur quite frequently when the network is unstable.
        // Demote these to 'error' level.
        var logFunction = /timeout/i.test(e.message) ? logger.error : logger.fatal;
        logFunction('Failed to save remote file.', e);
        var message = e.message;
        // This can happen if the user triggered the save while closing the file.
        // Unfortunately, we can't interrupt the user action, but we can at least reopen the buffer.
        if (this.destroyed) {
          message += '<br><br>Opening a new tab with your unsaved changes.';
          atom.workspace.open().then(function (editor) {
            return editor.setText(toSaveContents);
          });
        }
        atom.notifications.addError('Failed to save remote file ' + filePath + ': ' + message);
        success = false;
      }

      (0, _nuclideAnalytics.track)('remoteprojects-text-buffer-save-as', {
        'remoteprojects-file-path': filePath,
        'remoteprojects-save-success': success.toString()
      });
    })
  }, {
    key: 'updateCachedDiskContentsSync',
    value: function updateCachedDiskContentsSync() {
      throw new Error('updateCachedDiskContentsSync isn\'t supported in NuclideTextBuffer');
    }
  }, {
    key: 'updateCachedDiskContents',
    value: _asyncToGenerator(function* (flushCache, callback) {
      try {
        yield _get(Object.getPrototypeOf(NuclideTextBuffer.prototype), 'updateCachedDiskContents', this).call(this, flushCache, callback);
        this._exists = true;
      } catch (e) {
        this._exists = false;
        throw e;
      }
    })

    // Override of TextBuffer's implementation.
    // Atom tries to diff contents even for extremely large files, which can
    // easily cause the editor to lock.
    // TODO(hansonw): Remove after https://github.com/atom/text-buffer/issues/153 is resolved.
  }, {
    key: 'setTextViaDiff',
    value: function setTextViaDiff(newText) {
      if (this.getText().length > DIFF_FILE_SIZE_LIMIT || newText.length > DIFF_FILE_SIZE_LIMIT) {
        this.setText(newText);
      } else {
        _get(Object.getPrototypeOf(NuclideTextBuffer.prototype), 'setTextViaDiff', this).call(this, newText);
      }
    }
  }, {
    key: 'subscribeToFile',
    value: function subscribeToFile() {
      var _this = this;

      if (this.fileSubscriptions) {
        this.fileSubscriptions.dispose();
      }
      var file = this.file;
      (0, _assert2.default)(file, 'Cannot subscribe to no-file');
      this.fileSubscriptions = new _atom.CompositeDisposable();

      this.fileSubscriptions.add(file.onDidChange(_asyncToGenerator(function* () {
        var isModified = _this._isModified();
        _this.emitModifiedStatusChanged(isModified);
        if (isModified) {
          _this.conflict = true;
        }
        var previousContents = _this.cachedDiskContents;
        var previousSaveID = _this._saveID;
        yield _this.updateCachedDiskContents();
        // If any save requests finished in the meantime, previousContents is not longer accurate.
        // The most recent save request should trigger another change event, so we'll check for
        // conflicts when that happens.
        // Otherwise, what we wrote and what we read should match exactly.
        if (_this._saveID !== previousSaveID || previousContents === _this.cachedDiskContents) {
          _this.conflict = false;
          return;
        }
        if (_this.conflict) {
          _this.emitter.emit('did-conflict');
        } else {
          _this.reload();
        }
      })));

      this.fileSubscriptions.add(file.onDidDelete(function () {
        _this._exists = false;
        var modified = _this.getText() !== _this.cachedDiskContents;
        _this.wasModifiedBeforeRemove = modified;
        if (modified) {
          _this.updateCachedDiskContents();
        } else {
          _this.destroy();
        }
      }));

      this.fileSubscriptions.add(file.onDidRename(function () {
        _this.emitter.emit('did-change-path', _this.getPath());
      }));

      this.fileSubscriptions.add(file.onWillThrowWatchError(function (errorObject) {
        _this.emitter.emit('will-throw-watch-error', errorObject);
      }));
    }
  }, {
    key: '_isModified',
    value: function _isModified() {
      if (!this.loaded) {
        return false;
      }
      if (this.file) {
        if (this._exists) {
          return this.getText() !== this.cachedDiskContents;
        } else {
          return this.wasModifiedBeforeRemove ? !this.isEmpty() : false;
        }
      } else {
        return !this.isEmpty();
      }
    }
  }]);

  return NuclideTextBuffer;
})(_atom.TextBuffer);

module.exports = NuclideTextBuffer;

/* $FlowFixMe */

// This is a counter that will be incremented after every successful save request.
// We use this to accurately detect changes on disk - conflicts should not be reported
// if any saves finished while fetching the updated contents.