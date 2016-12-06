import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Volunteer from './Volunteer';
import VolunteerModal from './VolunteerModal'

//This is a child component of app.js and the parent of volunteer.js (and therefore a grandparent(?) of request.js)
class VolunteerRequestContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //this info was funneled down from app.js
      username: this.props.username,
      picture: this.props.picture,
      //This is currently hardcoded in, but eventually we want to retrieve this info from the database.
      volunteers:this.props.currentData,
    };

  }

  componentDidMount() { console.log('volunteers? ', this.state.volunteers);} 
  
  render() {
    return ( 
     <div className='request-container'>
        <div>
          <VolunteerModal onSubmit={this.props.postVolunteer} />
        </div>
        {this.state.volunteers.map(volunteer =>
                <Volunteer 
                //I put math.random because react got angry at me
                postRequest={this.props.postRequest}
                key={Math.random()}
                username={this.state.username}
                //commenting out picture for now
                picture={this.state.picture}
                //This maps out the volunteers in the this.state.volunteers array into the child component, volunteer
                volunteer={volunteer}/>
              )}
        <div className='center'><button className='red-button new-group' onClick={this.props.selectDifferentGroup}>Select a different group</button></div>
     </div>
    );
  }
  

  onLocationChange(event) {
  	this.setState({location: event.target.value});
  }

  onTimeChange(event) {
  	this.setState({time: event.target.value});
  }
  //Runs postVolunteer (inherited from App) with appropriate data, then resets state.
  onSubmit(event) {
    this.props.postVolunteer(this.state.username, this.state.location, this.state.time);
    //When the user clicks submit, time and location are set to '' and the info is saved into the this.state.volunteers array
    //Change this later to add database functionality
  	this.setState({time:'', location:'', volunteers: this.state.volunteers.concat({name: this.state.username, picture: this.state.picture, location: this.state.location, time: this.state.time})});
  }
  	
};

export default VolunteerRequestContainer;