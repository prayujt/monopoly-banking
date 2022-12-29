import { React, useState, useEffect } from 'react';
import { Card, Statistic, Row, Col } from 'antd';

import PropertyList from './PropertyList';

import 'antd/dist/reset.css';

const PlayerCard = (player) => {
    return (
        <div>
            <h1>{player.name}</h1>
            <Row>
                <Col span={12}>
                    <Card>
                        <Statistic title="Account Balance" value={`$${player.balance.toLocaleString('en-US')}`}/>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <PropertyList name={player.name}/>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlayerCard;
