//This component is the child component of volunteerRequestContainer.js and the parent of request.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Request from './Request.js';
import RequestModal from './RequestModal.js';

class Volunteer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //This info has been funneled down from volunteerRequestContainer, which was funneled down from app.js
      username: this.props.username,
      picture: this.props.picture,
      //we set text as '' because nothing has been entered yet.
      text:'',
      //requests is an array of stuff obtained from the database. 
      //It can be added to by the user by typing into the inputs and submitting.
      requests:this.props.volunteer.requests,
    };
  }
  onTextChange(event) {
    //every time the user types a new letter, the state is changed to the current input
    this.setState({text: event.target.value});
  }
     //set the text back to '' and add the info to the requests array
    //Note: for some reason, .push wouldn't work and I had to use .concat
      //run postRequest to generate a new request.
  onSubmit(){
    console.log('Volunteer?', this.props.volunteer);
    this.props.postRequest(this.state.username, this.props.volunteer._id, this.state.text);
    this.setState({text:'', requests: this.state.requests.concat({username: this.state.username, picture: this.state.picture, text: this.state.text})});
  }

  render() {
  	return ( 
        <div className='volunteer-div'>
          <img className='small-profile-pic' src={this.props.volunteer.picture}/>
          {this.props.volunteer.name} is going to {this.props.volunteer.location} at {this.props.volunteer.time}.
        
        {this.state.requests.map(request =>
          //this goes through the array of requests and maps them using the child component, Request.js
          <Request 
          //I threw math.random as the key because react kept getting angry at me for making duplicate keys??
            key= {Math.random()}
            request={request}/>
          )}
           <RequestModal onSubmit={this.onSubmit.bind(this)}/>
        </div>
  );
 }
 
};

export default Volunteer;