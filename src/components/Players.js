import { React, useState, useEffect } from 'react';
import { Row, Col } from 'antd';

import 'antd/dist/reset.css';

import PlayerCard from './PlayerCard';

const Players = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_SERVER_HOST}/players`)
            .then((response)=>response.json())
            .then((responseData)=>
            {
                let newPlayers = [];
                for (let i = 0; i < Math.ceil(responseData.length / 2.0); i++) {
                    if (2 * i + 1 === responseData.length) {
                        newPlayers.push({
                            0: responseData[2 * i]
                        })
                    }
                    else {
                        newPlayers.push({
                            0: responseData[2 * i],
                            1: responseData[2 * i + 1]
                        })
                    }
                }
                setPlayers(newPlayers);
            });
        }, 250);
    });

    let playerObject = players.map((row) => {
        if (Object.keys(row).length === 1) {
            return (
                <div>
                  <Row>
                    <PlayerCard key={row[0].name} name={row[0].name} balance={row[0].balance}/>
                  </Row>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Row>
                        <Col span={12}>
                            <PlayerCard key={row[0].name} name={row[0].name} balance={row[0].balance}/>
                        </Col>
                        <Col span={12}>
                            <PlayerCard key={row[1].name} name={row[1].name} balance={row[1].balance}/>
                        </Col>
                    </Row>
                </div>
            );
        }
    });

    return (
        <div>
            {playerObject}
        </div>
    );
}


export default Players;
