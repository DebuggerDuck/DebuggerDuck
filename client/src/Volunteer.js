//This component is the child component of volunteerRequestContainer.js and the parent of request.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Request from './Request';

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
      requests:[{username:'Cat', picture:'http://www.warrenphotographic.co.uk/photography/bigs/08482-Fluffy-ginger-female-kitten.jpg', text:'Pick me up a burrito'}]
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
    this.props.postRequest(this.state.username, this.props.volunteer, this.state.text);s
    this.setState({text:'', requests: this.state.requests.concat({username: this.state.username, picture: this.state.picture, text: this.state.text})});
  }

  render() {
  	return ( 
      <div>
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
          <div className='request-div'>
            What would you like {this.props.volunteer.name} to pick up for you? 
            <input value={this.state.text} onChange={this.onTextChange.bind(this)} /> 
            <button onClick={this.onSubmit.bind(this)} className="red-button">Send your requests</button>
        </div>
        </div>
     </div>
  );
 }
 
};

export default Volunteer;