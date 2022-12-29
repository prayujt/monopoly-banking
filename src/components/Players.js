import { React, useState, useEffect } from 'react';
import { Row, Col } from 'antd';

import 'antd/dist/reset.css';

import PlayerCard from './PlayerCard';

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [event, setEvent] = useState([]);

    useEffect(() => {
        let timeout = setTimeout(() => {
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
            fetch(`${process.env.REACT_APP_SERVER_HOST}/events/previous`)
            .then((response)=>response.json())
            .then((responseData)=>
            {
                setEvent(responseData);
            });
        }, 500);

        return () => clearTimeout(timeout);
    });

    let playerObject = players.map((row) => {
        if (Object.keys(row).length === 1) {
            return (
                <div>
                  <Row key="row">
                    <Col span={12} push={6}>
                        <PlayerCard
                        key={row[0].name}
                        change={(event.players !== undefined && row[0].name in event.players) ? event.players[row[0].name] : 0}
                        name={row[0].name}
                        balance={row[0].balance}
                        />
                    </Col>
                  </Row>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Row key="row">
                        <Col key="col1" span={12}>
                            <PlayerCard
                              key={row[0].name}
                              change={(event.players !== undefined && row[0].name in event.players) ? event.players[row[0].name] : 0}
                              name={row[0].name}
                              balance={row[0].balance}
                            />
                        </Col>
                        <Col key="col2" span={12}>
                            <PlayerCard
                              key={row[1].name}
                              change={(event.players !== undefined && row[1].name in event.players) ? event.players[row[1].name] : 0}
                              name={row[1].name}
                              balance={row[1].balance}
                            />
                        </Col>
                    </Row>
                </div>
            );
        }
    });

    return (
        <div key="div">
            {playerObject}
        </div>
    );
}


export default Players;
