Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideUiLibDropdown = require('../../nuclide-ui/lib/Dropdown');

var _reactForAtom = require('react-for-atom');

var _nuclideUiLibToolbar = require('../../nuclide-ui/lib/Toolbar');

var _nuclideUiLibToolbarLeft = require('../../nuclide-ui/lib/ToolbarLeft');

var SideBarPanelComponent = (function (_React$Component) {
  _inherits(SideBarPanelComponent, _React$Component);

  function SideBarPanelComponent() {
    _classCallCheck(this, SideBarPanelComponent);

    _get(Object.getPrototypeOf(SideBarPanelComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SideBarPanelComponent, [{
    key: 'focus',
    value: function focus() {
      _reactForAtom.ReactDOM.findDOMNode(this.refs['child']).focus();
    }
  }, {
    key: 'render',
    value: function render() {
      var toolbar = undefined;
      if (this.props.menuItems.length > 1) {
        toolbar = _reactForAtom.React.createElement(
          _nuclideUiLibToolbar.Toolbar,
          { location: 'top' },
          _reactForAtom.React.createElement(
            _nuclideUiLibToolbarLeft.ToolbarLeft,
            null,
            _reactForAtom.React.createElement(_nuclideUiLibDropdown.Dropdown, {
              isFlat: true,
              menuItems: this.props.menuItems,
              onSelectedChange: this.props.onSelectedViewMenuItemChange,
              selectedIndex: this.props.selectedViewMenuItemIndex
            })
          )
        );
      }

      return _reactForAtom.React.createElement(
        'div',
        { style: { display: 'flex', flex: 1, flexDirection: 'column' }, tabIndex: 0 },
        toolbar,
        _reactForAtom.React.cloneElement(_reactForAtom.React.Children.only(this.props.children), { ref: 'child' })
      );
    }
  }]);

  return SideBarPanelComponent;
})(_reactForAtom.React.Component);

exports.default = SideBarPanelComponent;
module.exports = exports.default;