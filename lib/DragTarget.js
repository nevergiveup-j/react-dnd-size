'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DragTarget = function (_Component) {
  _inherits(DragTarget, _Component);

  function DragTarget(props) {
    _classCallCheck(this, DragTarget);

    var _this = _possibleConstructorReturn(this, (DragTarget.__proto__ || Object.getPrototypeOf(DragTarget)).call(this, props));

    _this.state = {
      style: {},
      cntID: 'dnds-context',
      mousePoiner: {},
      cntPoiner: {}
    };
    _this.onDragStart = _this.onDragStart.bind(_this);
    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onDragMove = _this.onDragMove.bind(_this);
    _this.onDragUp = _this.onDragUp.bind(_this);
    return _this;
  }

  _createClass(DragTarget, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.zIndex = 1;
      this.setDefaultProps();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var cntID = this.state.cntID;


      this.dragContext = document.getElementById(cntID);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setDefaultProps(nextProps);
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart(event) {
      this.props.onDragStart && this.props.onDragStart(event);
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      var _this2 = this;

      var style = this.state.style;
      var target = event.target;

      var getBoundingClientRect = target.getBoundingClientRect();
      var scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
      var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

      var eleX = event.pageX - getBoundingClientRect.left - scrollLeft;
      var eleY = event.pageY - getBoundingClientRect.top - scrollTop;

      var mousePoiner = {
        eleX: eleX,
        eleY: eleY,
        width: getBoundingClientRect.width,
        height: getBoundingClientRect.height,
        left: getBoundingClientRect.left - scrollLeft,
        top: getBoundingClientRect.top - scrollTop
      };

      var cntPoiner = this.dragContext ? this.dragContext.getBoundingClientRect() : {};

      this.zIndex += 1;

      style.zIndex = this.zIndex;

      this.setState({
        mousePoiner: mousePoiner,
        cntPoiner: cntPoiner,
        style: style
      }, function () {
        window.addEventListener('mousemove', _this2.onDragMove);
        window.addEventListener('mouseup', _this2.onDragUp);
      });
    }
    // 拖动移动

  }, {
    key: 'onDragMove',
    value: function onDragMove(event) {
      var _state = this.state,
          style = _state.style,
          mousePoiner = _state.mousePoiner;

      document.body.style.userSelect = 'none';

      var eleX = event.pageX - mousePoiner.eleX;
      var eleY = event.pageY - mousePoiner.eleY;

      if (this.dragContext) {
        var limitMove = this.limitMove(eleX, eleY);

        if (limitMove) {
          eleX = limitMove.x;
          eleY = limitMove.y;
        }
      }

      style.top = eleY;
      style.left = eleX;

      this.setState({ style: style });
    }
    // 拖动松开

  }, {
    key: 'onDragUp',
    value: function onDragUp() {
      document.body.style.userSelect = '';

      window.removeEventListener('mousemove', this.onDragMove);
      window.removeEventListener('mouseup', this.onDragUp);
    }
    /**
     * 设置默认Props
     * @param {object} props 参数
     */

  }, {
    key: 'setDefaultProps',
    value: function setDefaultProps() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var style = this.props.style;


      style = Object.assign(style, _extends({
        cursor: 'move'
      }, props.style));

      this.setState({ style: style });
    }
    // 限制移动

  }, {
    key: 'limitMove',
    value: function limitMove(eleX, eleY) {
      var _state2 = this.state,
          mousePoiner = _state2.mousePoiner,
          cntPoiner = _state2.cntPoiner;


      switch (true) {
        case eleX <= cntPoiner.left:
          eleX = 0;
          break;
        case eleX >= cntPoiner.left + cntPoiner.width - mousePoiner.width:
          eleX = cntPoiner.width - mousePoiner.width;
          break;
        default:
          eleX -= cntPoiner.left;
      }

      switch (true) {
        case eleY <= cntPoiner.top:
          eleY = 0;
          break;
        case eleY >= cntPoiner.top + cntPoiner.height - mousePoiner.height:
          eleY = cntPoiner.height - mousePoiner.height;
          break;
        default:
          eleY -= cntPoiner.top;
      }

      return {
        x: eleX,
        y: eleY
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var style = this.state.style;


      var cls = (0, _classnames2.default)({
        'dnds-target': true,
        'dnds-target-size': true
      });

      return _react2.default.createElement(
        'div',
        {
          style: _extends({}, style),
          className: cls,
          onDragStart: this.onDragStart,
          onMouseDown: this.onMouseDown },
        this.props.children,
        _react2.default.createElement(
          'div',
          { className: 'dnds-bar' },
          _react2.default.createElement(
            'div',
            { className: 'dnds-bar-line dnds-bar-t' },
            _react2.default.createElement('div', { className: 'dnds-bar-radius' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'dnds-bar-line dnds-bar-r' },
            _react2.default.createElement('div', { className: 'dnds-bar-radius' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'dnds-bar-line dnds-bar-b' },
            _react2.default.createElement('div', { className: 'dnds-bar-radius' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'dnds-bar-line dnds-bar-l' },
            _react2.default.createElement('div', { className: 'dnds-bar-radius' })
          ),
          _react2.default.createElement('div', { className: 'dnds-bar-radius dnds-bar-radius-tl' }),
          _react2.default.createElement('div', { className: 'dnds-bar-radius dnds-bar-radius-tr' }),
          _react2.default.createElement('div', { className: 'dnds-bar-radius dnds-bar-radius-bl' }),
          _react2.default.createElement('div', { className: 'dnds-bar-radius dnds-bar-radius-br' })
        )
      );
    }
  }]);

  return DragTarget;
}(_react.Component);

DragTarget.defaultProps = {
  onDragStart: function onDragStart() {}
  // style: {},
};

DragTarget.propTypes = {
  onDragStart: _propTypes2.default.func
  // style: PropTypes.object,
};

exports.default = DragTarget;