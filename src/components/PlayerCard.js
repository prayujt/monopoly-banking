import { React, useState, useEffect } from 'react';
import { Statistic } from 'antd';

import PropertyList from './PropertyList';

import 'antd/dist/reset.css';

const PlayerCard = (player) => {
    return (
        <div>
            <h1>{player.name}</h1>
            <Statistic title="Account Balance" value={`$${player.balance.toLocaleString('en-US')}`}/>
            <PropertyList name={player.name}/>
        </div>
    )
}

export default PlayerCard;
