import React, {Component} from 'react';
import {render} from 'react-dom';

import './index.less';

class App extends Component {
  
  state = {};

  componentDidMount() {}
  
  render() {
    return (
      <div className="container">Hello World!</div>
    )
  }
}

render(<App/>, document.getElementById('root'));