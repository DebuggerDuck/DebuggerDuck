//App.js is the top component. It stores all the main data within its state.
//It renders 3 different views based on its state (described in detail below).
//It funnels down user data into its child components.
//The hierarchy is described below.

//           _________________App_______
//          /             /     |       \
//  NavBar    LandingPage     Groups    VolunteerRequestContainer
//       \     /                |            |              |
//       FacebookButton    Group Modal    volunteer     volunteer modal
//                                          /   \
//                                   request    request modal

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import io from 'socket.io-client'
import NavBar from './NavBar.js';
import LandingPage from './LandingPage.js';
import Groups from './Groups.js';
import VolunteerRequestsContainer from './VolunteerRequestsContainer.js';
import GroupModal from './GroupModal.js';
import StatusView from './StatusView.js';

let socket = io();
//Primary component for App.
class Runner extends Component {
  constructor(props) {
    super(props);
//holds the logged in state, username, picture
//****      ERROR     *****  happens when this.state.username = '' (undefined), it isn't changed somehow
    this.state = {
      loggedIn: false,
      username: '',
      picture: '',
      currentGroup: '',
      userId: '',
      groups:[],
      //currentData holds all volunteers and requests.
      currentData:[],
      role : null
      // socket:{this.socket}
    };
    //Binding context for functions that get passed down.
    //this.getGroups = this.getGroups.bind(this);
    this.getCurrentData = this.getCurrentData.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.postLogout = this.postLogout.bind(this);
    this.currentOrderId = null;
    this.orderUser = null;
    this.location = null;
    this.time = null;
    this.requestText = null;
    this.orderUserPicture = null;
  }

  ///Run functions on component load so data is available.
  componentDidMount() {
   this.postLogin();
   this.getGroups();
   this.getCurrentData();
   socket.emit('app mounted', 'app mounted');
   socket.on('app mounted', function(msg){
    console.log('app mounted --- msg: ', msg)
   })
  }

//Returns the mongo id for a given group name.
  getIdFromGroupName(name) {
    for (var i=0;i<this.state.groups.length;i++){
      if (this.state.groups[i].name===name){
        return this.state.groups[i]._id;
      } else {
        console.log('Group Id not found')
      }
    }
  }
  //Helper function to change Group.
  selectGroup(name){
    this.setState({currentGroup: name});
  }
  selectDifferentGroup(){
    this.setState({currentGroup:''});
    //this rerenders the app to go back to option 2 (mentioned above)
  }

//Adds a new group to DB.
  postGroup(groupName){
    //this.setState({groupChosen:true});
    axios.post('/api/group', {data:{"groupName":groupName}})
      .then( response =>{
        this.getGroups();
      })
       .catch(error => {
        console.log('Error while getting groups: ', error);
    });
  }

//Gets full list of available groups and updates state.
  getGroups(){
    axios.get('/api/group')
      .then( response => {
        this.setState( {groups:response.data.data} );
        console.log('Group State?',this.state.groups);
    })
      .catch(error => {
        console.log('Error while getting groups: ', error);
    })
  }

  // //Gets all volunteers for today, and all associated requests.
  //   //updates currentData in state, which is then passed to VolunteerRequest Container.
  getCurrentData() {
    axios.get('/api/volunteer')
      .then(response => {
        var ourData = response.data.data;
        console.log('Getting Current Data?', ourData);
        this.setState({currentData: ourData});
      })
      .catch(error => {
        console.log('Error while getting current data: ', error);
      })
  }

//Triggers FB login, then retrieves user info from DB/FB.
  getUserData(){
    axios.get('/api/user')
      .then(response => {
        console.log('User info sucessfully retrieved', response);
        this.setState({username: response.data.username});
        this.setState({picture: response.data.picture});
        this.setState({userId: response.data._id})
        console.log(response.data.picture)
      })
      .catch(error =>{
        console.log('Error while getting user info', error)
      })
  }

//Checks server to confirm if user is already logged in.
  postLogin() {
    axios.get('/api/user/loggedin')
      .then(response => {
        console.log('Login successful? ', response);
        this.setState({loggedIn: true});
        this.getUserData()
      })
      .catch(error => {
        console.log('Error occurred during login ', error);
      })
  }

  //postLogout sends request to server to log out user and kill session.
    //As above, may need to be updated.
  postLogout() {
    axios.get('/api/user/logout')
      .then(response => {
        console.log('Logged out:', response);
        this.setState({loggedIn: false});
        this.getUserData();
      })
      .catch(error => {
        console.log('Error while logging out: ', error);
      })
  }

  //postVolunteer POSTS a new volunteer to the server.
    //Accepts a location, a time, and group.  Pulls username from state.
  postVolunteer(location, time, group, orderNumber) {
    this.currentOrderId = orderNumber;
    this.time = time;
    this.location = location;
    this.orderUser = this.state.username;
    this.orderUserPicture = this.state.picture;
    axios.post('/api/volunteer', {data:{
      username: this.state.username,
      location: location,
      time:  time,
      picture: this.state.picture,
      groupId: this.getIdFromGroupName(group),
      orderNumber: orderNumber
      }
    })
    .then(response => {
      console.log('Volunteer posted! ',response);
      this.getCurrentData();
      this.render();
    })
    .catch(error => {
      console.log('Error while posting Volunteer: ',error);
    });
  }

  // postRequest sends a food request to the server.
  // orderId is the mongo db record for the volunteer (in the mongo Order table.)
    //text is what the user requested.
    //username for hte request is pulled from state.

  postRequest(orderNumber, text, orderUser, picture, time, location) {
      this.orderUser = orderUser;
      this.currentOrderId = orderNumber;
      this.time = time;
      this.location = location;
      this.requestText = text;
      this.orderUserPicture = picture;

      axios.post('/api/request', {data:{
      //don't remove.
      username: orderUser,
      orderId: orderId,
      picture: picture,
      text: text

      }
    })
      .then(response => {
        console.log('Request submitted: ', response.data);
      })
      .catch(error => {
        console.log('Error while submitting food request:', error);
      })
  }

  changeRole(role){
    this.setState({role: role});
  }

  //There are three possible options when we reach the home page.
//For each option a navbar is rendered regardless of state.
//1. LoggedIn is false -> render the Landing page component.
//2. LoggedIn is true but group chosen is false -> render the groups component.
//3. LoggedIn is true and groups chosen is true -> render the Volunteer button and volunteer component
// (Which in turn, will render the request component(s))

  render() {
    if (this.state.role === 'receiver') {console.log("RECEIVER RECEIVED!")}
    if(this.state.role === null){
      if (this.state.loggedIn===false){
        return (
          <div>
            <div className='nav-bar'></div>
            <LandingPage />
          </div>
          )
      } else {
        if (this.state.currentGroup===''){
          return (
            <div>
            <NavBar
            //Funnel down info into the navbar
            loggedIn={true}
            postLogout={this.postLogout.bind(this)}
            postLogin={this.postLogin.bind(this)}
            username={this.state.username}
            picture={this.state.picture}/>
            <div className='greeting'> Hi, {this.state.username}.</div>
            <div className='group-select'>Please select a group.</div>
              {this.state.groups.map(group =>
                //This maps out all the groups into a list.
                <Groups
                //If I don't put a key in, react gets angry with me.
                selectGroup={this.selectGroup.bind(this)}
                key={Math.random()}
                group={group.name} />
              )}
              <div className='center'>
                <GroupModal postGroup={this.postGroup.bind(this)}/>
              </div>
            </div>
            )
        } else {
          return (
            <div>
              <NavBar
              //Again, funneling info to the navbar.
                //Also passing in login and logout functions.
                loggedIn={true}
                postLogout={this.postLogout.bind(this)}
                postLogin={this.postLogin.bind(this)}
                username={this.state.username}
                picture={this.state.picture} />
              <VolunteerRequestsContainer
              //This also needs to be funneled info
                changeRole={this.changeRole.bind(this)}
                getIdFromGroupName={this.getIdFromGroupName.bind(this)}
                username={this.state.username}
                picture={this.state.picture}
                currentGroup={this.state.currentGroup}
                currentData={this.state.currentData}
                getCurrentData={this.getCurrentData.bind(this)}
                postVolunteer={this.postVolunteer.bind(this)}
                postRequest={this.postRequest.bind(this)}
                //We pass down the selectDifferentGroup function to this component since the button is rendered there
                selectDifferentGroup={this.selectDifferentGroup.bind(this)} />
            </div>
            )
          }
      }
    }
      else if (this.state.role === 'fetcher' || this.state.role==='receiver'){
        console.log('ROLE IS :', this.state.role)
        console.log('ORDER NUMBER is ', this.currentOrderId)
        return(
          <div>
            <StatusView
              username={this.state.username}
              orderId={this.currentOrderId}
              time={this.time}
              location={this.location}
              orderUser={this.orderUser}
              picture={this.orderUserPicture}
              text={this.text}
              role={this.state.role}
              changeRole={this.changeRole.bind(this)}
              />
          </div>
          )
      }
  }
};


export default Runner;
