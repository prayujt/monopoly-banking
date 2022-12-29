import { React, useState, useEffect } from 'react';
import { Timeline } from 'antd';

import 'antd/dist/reset.css';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        let timeout = setTimeout(() => {
            fetch(`${process.env.REACT_APP_SERVER_HOST}/events`)
            .then((response)=>response.json())
            .then((responseData)=>
            {
                setEvents(responseData);
            });
        }, 500);

        return () => clearTimeout(timeout);
    });

  return (
    <div>
      <center>
        <h1>Events:</h1>
      </center>
      <Timeline>
        {events.map((event) => {
          return <Timeline.Item key={event.time} color={event.color}>{event.event}</Timeline.Item>
        })}
      </Timeline>
    </div>
  );
}

export default Events;
