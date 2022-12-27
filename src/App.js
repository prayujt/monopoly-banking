import React from 'react';
import { Col, Row } from 'antd';

import Players from './components/Players';
import PropertyMap from './components/PropertyMap'

const App = () => (

  <div className="App">
    <Row>
      <Col span={8}>
        <Players/>
      </Col>
      <Col span={16}>
        <PropertyMap/>
      </Col>
    </Row>
  </div>

);

export default App;
