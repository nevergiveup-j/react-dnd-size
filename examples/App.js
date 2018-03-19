import React, { Component } from 'react';

import { DragContext, DragTarget } from '../src';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="form-wrap">
        <DragContext>
          <DragTarget style={{ top: '20px', left: '30px' }}>
            <div className="targe-text">test..</div>
          </DragTarget>
          <DragTarget style={{ top: '20px', left: '230px' }}>
            <div className="targe-text">test1..</div>
          </DragTarget>
        </DragContext>
        <div>1111</div>
      </div>
    );
  }
}

export default App;
