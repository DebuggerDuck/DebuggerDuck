import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import PickUpOffers from './PickUpOffers.jsx'
import Chat from './Chat.js'

//This is a child component of app.js and the parent of volunteer.js (and therefore a grandparent(?) of request.js)
class VolunteerRequestContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="appAndKey">
        <div className="keyContainer">Share this key with the people you like enough to get food for: <span className="uniqueKey"> {this.props.group._id}</span></div>
      <div className="display">
        <Chat user={this.props.user} group={this.props.group} />
        <PickUpOffers user={this.props.user} group={this.props.group} selectDifferentGroup={this.props.selectDifferentGroup}  />
      </div>
    </div>
    )
  }
};

export default VolunteerRequestContainer;
