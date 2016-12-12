//This component is the child component of volunteerRequestContainer.js and the parent of request.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Request from './Request.js';
import RequestModal from './RequestModal.js';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //This info has been funneled down from volunteerRequestContainer, which was funneled down from app.js
      username: this.props.pickup.order_user,
      picture: this.props.pickup.picture,
      //we set text as '' because nothing has been entered yet.
      text:'',
      //requests is an array of stuff obtained from the database.
      //It can be added to by the user by typing into the inputs and submitting.
      requests:this.props.pickup.requests,
      count:0
    };

    this.postRequest = this.postRequest.bind(this);
  }
  onTextChange(event) {
    //every time the user types a new letter, the state is changed to the current input
    this.setState({text: event.target.value});
  }
  //Run postRequest to send request data to the server.
  //update text state to reset box.
  //run getDataforRendering to update App (somewhat ugly, last-minute hack).
  //update existing requests with new data from props.
  onSubmit(text){
    //console.log('Text?', text, "volunteer id", this.props.volunteer._id);
    this.postRequest(this.props.pickup._id, text);
    this.setState({text:''});
    this.props.getDataForRendering();
    // this.setState({requests:this.props.volunteer.requests})
  }

  postRequest(volunteerId, text) {
      axios.post('/api/request', {data:{
      //don't remove.
      username: this.state.user.username,
      volunteerId: volunteerId,
      picture: this.state.user.picture,
      text: text,

      }
    })
      .then(response => {
        console.log('Request submitted: ', response.data);
        console.log('USER', this.state)
      })
      .catch(error => {
        console.log('Error while submitting food request:', error);
      })
  }


  render() {
    console.log('pickup', this.props.pickup)
  	return (
        <div className='volunteer-div' onClick={() => this.props.selectThisOrder(this.props.pickup)}>
          <img className='small-profile-pic' src={this.props.pickup.picture}/>
          {this.props.pickup.orderer_userName} is going to {this.props.pickup.location} at {this.props.pickup.time}.
        </div>
  );
 }

};

export default Order;
