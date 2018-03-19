import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class DragTarget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
      cntID: 'dnds-context',
      mousePoiner: {},
      cntPoiner: {},
    };
    this.onDragStart = this.onDragStart.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragUp = this.onDragUp.bind(this);
  }
  componentWillMount() {
    this.zIndex = 1;
    this.setDefaultProps();
  }
  componentDidMount() {
    const { cntID } = this.state;

    this.dragContext = document.getElementById(cntID);
  }
  componentWillReceiveProps(nextProps) {
    this.setDefaultProps(nextProps);
  }
  onDragStart(event) {
    this.props.onDragStart && this.props.onDragStart(event);
  }
  onMouseDown(event) {
    const { style } = this.state;
    const { target } = event;
    const getBoundingClientRect = target.getBoundingClientRect();
    const scrollLeft = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
    const scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

    const eleX = event.pageX - getBoundingClientRect.left - scrollLeft;
    const eleY = event.pageY - getBoundingClientRect.top - scrollTop;

    const mousePoiner = {
      eleX,
      eleY,
      width: getBoundingClientRect.width,
      height: getBoundingClientRect.height,
      left: getBoundingClientRect.left - scrollLeft,
      top: getBoundingClientRect.top - scrollTop,
    };

    const cntPoiner = this.dragContext ? this.dragContext.getBoundingClientRect() : {};

    this.zIndex += 1;

    style.zIndex = this.zIndex;

    this.setState({
      mousePoiner,
      cntPoiner,
      style,
    }, () => {
      window.addEventListener('mousemove', this.onDragMove);
      window.addEventListener('mouseup', this.onDragUp);
    });
  }
  // 拖动移动
  onDragMove(event) {
    const { style, mousePoiner } = this.state;
    document.body.style.userSelect = 'none';

    let eleX = event.pageX - mousePoiner.eleX;
    let eleY = event.pageY - mousePoiner.eleY;

    if (this.dragContext) {
      const limitMove = this.limitMove(eleX, eleY);

      if (limitMove) {
        eleX = limitMove.x;
        eleY = limitMove.y;
      }
    }

    style.top = eleY;
    style.left = eleX;

    this.setState({ style });
  }
  // 拖动松开
  onDragUp() {
    document.body.style.userSelect = '';

    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragUp);
  }
  /**
   * 设置默认Props
   * @param {object} props 参数
   */
  setDefaultProps(props = this.props) {
    let { style } = this.props;

    style = Object.assign(style, {
      cursor: 'move',
      ...props.style,
    });

    this.setState({ style });
  }
  // 限制移动
  limitMove(eleX, eleY) {
    const { mousePoiner, cntPoiner } = this.state;

    switch (true) {
      case eleX <= cntPoiner.left:
        eleX = 0;
        break;
      case eleX >= ((cntPoiner.left + cntPoiner.width) - mousePoiner.width):
        eleX = cntPoiner.width - mousePoiner.width;
        break;
      default:
        eleX -= cntPoiner.left;
    }

    switch (true) {
      case eleY <= cntPoiner.top:
        eleY = 0;
        break;
      case eleY >= ((cntPoiner.top + cntPoiner.height) - mousePoiner.height):
        eleY = cntPoiner.height - mousePoiner.height;
        break;
      default:
        eleY -= cntPoiner.top;
    }

    return {
      x: eleX,
      y: eleY,
    };
  }
  render() {
    const { style } = this.state;

    const cls = classnames({
      'dnds-target': true,
      'dnds-target-size': true,
    });

    return (
      <div
        style={{
          ...style,
        }}
        className={cls}
        onDragStart={this.onDragStart}
        onMouseDown={this.onMouseDown}>
        {this.props.children}
        <div className="dnds-bar">
          <div className="dnds-bar-line dnds-bar-t">
            <div className="dnds-bar-radius" />
          </div>
          <div className="dnds-bar-line dnds-bar-r">
            <div className="dnds-bar-radius" />
          </div>
          <div className="dnds-bar-line dnds-bar-b">
            <div className="dnds-bar-radius" />
          </div>
          <div className="dnds-bar-line dnds-bar-l">
            <div className="dnds-bar-radius" />
          </div>
          <div className="dnds-bar-radius dnds-bar-radius-tl" />
          <div className="dnds-bar-radius dnds-bar-radius-tr" />
          <div className="dnds-bar-radius dnds-bar-radius-bl" />
          <div className="dnds-bar-radius dnds-bar-radius-br" />
        </div>
      </div>
    );
  }
}

DragTarget.defaultProps = {
  onDragStart: () => {},
  // style: {},
};

DragTarget.propTypes = {
  onDragStart: PropTypes.func,
  // style: PropTypes.object,
};

export default DragTarget;
