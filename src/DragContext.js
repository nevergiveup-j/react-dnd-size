import React, { Component } from 'react';

class DragContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cntID: 'dnds-context',
    };
  }
  componentDidMount() {
  }
  render() {
    const { cntID } = this.state;
    return (
      <div id={cntID} className="dnds-context">
        {this.props.children}
      </div>
    );
  }
}

export default DragContext;
