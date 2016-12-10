import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Volunteer from './Volunteer';
import VolunteerModal from './VolunteerModal'
import Order from './order'

//This is a child component of app.js and the parent of volunteer.js (and therefore a grandparent(?) of request.js)
class PickUpOffers extends Component {
  constructor(props) {
    super(props);
    console.log('prrrrrrrrrro', this.props)
    var socket = io();
    socket.emit('createRoom', this.props.group._id)
    socket.on('addMessage', function(mess) {
      console.log(mess)
    })
    this.state = {
      pickups: [],
      ordersView: true,
      requests: []
    };

    this.getOrdersForGroupId = this.getOrdersForGroupId.bind(this, this.props.group._id);
    this.getOrdersForGroupId();
  }

  getOrdersForGroupId(groupId) {
    axios.get('/api/group/'+groupId+'/volunteer')
      .then(response => {
        console.log('Getting Current Data?', response.data.data);
        this.setState({pickups: response.data.data});
      })
      .catch(error => {
        console.log('Error while getting current data: ', error);
      })
  }

   changeView(){
    this.setState({
      ordersView: !this.state.ordersView,
      order: this

    });
  }

  render() {
    var orderRequestView = this.state.ordersView ?  
          <Order 
          order={this.state.order}
          />
           :
            this.state.pickups.map(pickup =>
            //Render one Volunteer component for each current volunteer in a given group.
            <Volunteer
            //I put math.random because react got angry at me
            key={Math.random()}
            pickup={pickup}
            selectThisOrder={this.changeView.bind(this)}
            // getDataForRendering={this.getDataForRendering.bind(this)}
            />
          );
           

    console.log('volunteer count', this.state.pickups.length)
    //Here we check if no one has volunteered yet. If so, we render a div that tells the user that no one has volunteered yet.
    //If they do volunteer, this.state.volunteer will change and the page will render immediately and will display their info.
    if (this.state.pickups.length === 0){
      return(
        <div className='request-container'>
          <div>
            <VolunteerModal
            user={this.props.user}
            group={this.props.group}
            onSubmit={this.getOrdersForGroupId} />
          </div>
          <div className='no-requests center'>No one has volunteered to grab food yet. Why don't you go first?</div>
          <div className='center'><button className='red-button new-group' onClick={this.props.selectDifferentGroup}>Select a different group</button></div>
        </div>
        )
    } else {
      //If there are already pickups in the system for this particular group, render them.
      return (
        //VolunteerModal pops up when you click the Volunteer Services button
     <div className='request-container'>
        <div>
          <VolunteerModal
          user={this.props.user}
          group={this.props.group}
          onSubmit={this.getOrdersForGroupId} />
        </div>
        <div>
       {orderRequestView}
       </div>
        <div className='center'><button className='red-button new-group' onClick={this.props.selectDifferentGroup}>Select a different group</button></div>
     </div>
    );
    }
  }

};

export default PickUpOffers;
