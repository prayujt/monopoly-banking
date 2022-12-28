import { React, useState, useEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { List, Divider } from 'antd';

import 'antd/dist/reset.css';

import PlayerCard from './PlayerCard';

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
            <List
                itemLayout="horizontal"
                dataSource={players}
                renderItem={(item) => (
                    <div>
                        <Divider />
                        <PlayerCard name={item.name} balance={item.balance}/>
                    </div>
                    /*     {/\* <Button *\/} */
                    /*     {/\* onClick={() => { *\/} */
                    /*     {/\*     fetch(`${process.env.REACT_APP_SERVER_HOST}/players/remove`, { *\/} */
                    /*     {/\*         method: 'DELETE', *\/} */
                    /*     {/\*         body: JSON.stringify({name: item.name}), *\/} */
                    /*     {/\*         headers: { 'Content-Type': 'application/json' } *\/} */
                    /*     {/\*     }); *\/} */
                    /*     {/\* }} *\/} */
                    /*     {/\* type="link"> *\/} */
                    /*     {/\* </Button> *\/} */
                )}
            />
        </div>
    );
}


export default Players;
