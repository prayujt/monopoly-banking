import React from 'react';
import { Col, Row } from 'antd';

import Players from './components/Players';
import Events from './components/Events'

const App = () => (

  <div className="App">
    <Row>
      <Col span={18}>
        <Players/>
      </Col>
      <Col span={6}>
        <Events/>
      </Col>
    </Row>
  </div>

);

export default App;
