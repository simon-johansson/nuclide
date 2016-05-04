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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactForAtom = require('react-for-atom');

var _nuclideUiLibCustomPaneItem = require('../../nuclide-ui/lib/CustomPaneItem');

var _VcsLog = require('./VcsLog');

var _VcsLog2 = _interopRequireDefault(_VcsLog);

var VcsLogPaneItem = (function (_CustomPaneItem) {
  _inherits(VcsLogPaneItem, _CustomPaneItem);

  function VcsLogPaneItem() {
    _classCallCheck(this, VcsLogPaneItem);

    _get(Object.getPrototypeOf(VcsLogPaneItem.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(VcsLogPaneItem, [{
    key: '__renderPaneItem',
    value: function __renderPaneItem(options) {
      return _reactForAtom.React.createElement(_VcsLog2.default, options.initialProps);
    }
  }, {
    key: 'updateWithLogEntries',
    value: function updateWithLogEntries(logEntries) {
      this.__component.setState({ logEntries: logEntries });
    }
  }]);

  return VcsLogPaneItem;
})(_nuclideUiLibCustomPaneItem.CustomPaneItem);

module.exports = document.registerElement('nuclide-vcs-log', { prototype: VcsLogPaneItem.prototype });