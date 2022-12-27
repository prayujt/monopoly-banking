import { React, useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Typography, List, Avatar, Button } from 'antd';

import 'antd/dist/reset.css';

const { Title } = Typography;


const Players = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            fetch(`${process.env.REACT_APP_SERVER_HOST}/players/list`)
            .then((response)=>response.json())
            .then((responseData)=>
            {
                setPlayers(responseData);
            });
        }, 250);
    });

    return (
        <div>
            <Typography>
                <Title>Players:</Title>
            </Typography>

            <List
                itemLayout="horizontal"
                dataSource={players}
                renderItem={(item) => (
                        <List.Item>
                            <Button
                            onClick={() => {
                                fetch(`${process.env.REACT_APP_SERVER_HOST}/players/remove`, {
                                    method: 'DELETE',
                                    body: JSON.stringify({name: item.name}),
                                    headers: { 'Content-Type': 'application/json' }
                                });
                            }}
                            type="link">
                                <List.Item.Meta
                                    /* avatar={<Avatar src="https:joeschmoe.io/api/v1/random" />} */
                                    avatar={<Avatar icon={<UserOutlined />}/>}
                                    title={item.name}
                                    description=""
                                />
                            </Button>
                        </List.Item>
                )}
            />
        </div>
    );
}


export default Players;
