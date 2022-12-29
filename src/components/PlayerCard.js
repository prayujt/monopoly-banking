import { React } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

import PropertyList from './PropertyList';

import 'antd/dist/reset.css';

const PlayerCard = (player) => {
    let change;
    if (player.change !== 0) {
        let color = player.change < 0 ? '#cf1322' : '#3f8600';
        change =
            <Statistic
            value={player.change}
            valueStyle={{ color: color }}
            prefix={player.change < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            />
    }

    return (
        <div>
            <center>
                <h1>{player.name}</h1>
            </center>
            <Row>
                <Col span={24}>
                    <Card>
                        <Statistic title="Account Balance" value={`$${player.balance.toLocaleString('en-US')}`}/>
                        {change}
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card>
                        <PropertyList name={player.name}/>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlayerCard;
