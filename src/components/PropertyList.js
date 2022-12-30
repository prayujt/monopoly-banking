import { React, useState, useEffect } from 'react';
import { Avatar, List, Tag } from 'antd';
import { RocketOutlined, GlobalOutlined, PhoneFilled } from '@ant-design/icons';

const MortgageEval = (props) => {
  if (props.property.mortgaged === 1) {
    return (
      <Tag color="error">mortgaged</Tag>
    );
  }
}

const PropertyIcon = (props) => {
  if (props.property.propName.indexOf('Airport') !== -1) return <RocketOutlined rotate={45}/>;
  else if (props.property.propName.indexOf('Internet') !== -1) return <GlobalOutlined />;
  else if (props.property.propName.indexOf('Cell') !== -1) return <PhoneFilled rotate={105}/>;
  else return <Avatar style={{ backgroundColor: props.property.color }}/>;
}

const Property = (props) => {
  if (props.event.properties === undefined || props.property.propName === undefined) return;
  let color = props.event.properties.indexOf(props.property.propName) !== -1 ? "#EFEEEC" : "#FFFFFF";
  return (
    <List.Item style={{ backgroundColor: color }}>
      <List.Item.Meta
        avatar=<PropertyIcon property={props.property}/>
        /* avatar={<Avatar style={{ backgroundColor: property.color }} />} */
        title={props.property.propName}
        /* description={`$${property.price.toLocaleString('en-US')}`} */
        description=<MortgageEval property={props.property}/>
      />
    </List.Item>
  );
}

const PropertyList = (player) => {
    const [properties, setProperties] = useState([]);
    const [event, setEvent] = useState([]);

    useEffect(() => {
        let timeout = setTimeout(() => {
            fetch(`${process.env.REACT_APP_SERVER_HOST}/players/${player.name}/properties`)
            .then((response)=>response.json())
            .then((responseData)=>
            {
                setProperties(responseData);
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

    // if (properties.length === 0) {
    //   return (
    //     <h3>No properties found</h3>
    //   )
    // }
    return (
      <List
          size="small"
          itemLayout="horizontal"
          dataSource={properties}
          renderItem={(property) => (
            <Property event={event} property={property}/>
          )}
        />
    );
}

export default PropertyList;
