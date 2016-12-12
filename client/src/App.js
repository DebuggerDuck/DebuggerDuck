//App.js is the top component. It stores all the main data within its state.
//It renders 3 different views based on its state (described in detail below).
//It funnels down user data into its child components.
//The hierarchy is described below.

//                             App
//          /             /     |       \
//  NavBar    LandingPage     Groups    VolunteerRequestContainer
//       \     /                |         |        |
//       FacebookButton    Group Modal  chat  pickupoffers............................
//                                           /     \          \                 \
//                                    request  request modal  volunteer modal   volunteer

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


import NavBar from './NavBar';
import LandingPage from './LandingPage.js';
import Groups from './Groups.js';
import VolunteerRequestsContainer from './VolunteerRequestsContainer.js';
import GroupModal from './GroupModal.js';
import JoinGroupModal from './JoinGroupModal.js';
import Chat from './Chat.js';

//Primary component for App.
class App extends Component {
  constructor(props) {
    super(props);
//holds the logged in state, userName, picture
    this.state = {
      loggedIn: false,
      user : {
        picture: '',
        groups: []
      },
      currentGroup: undefined,
    };
    //Binding context for functions that get passed down.
    //this.getGroupsForUserId = this.getGroupsForUserId.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.postLogout = this.postLogout.bind(this);
    this.addUserToGroup = this.addUserToGroup.bind(this);
    this.selectDifferentGroup = this.selectDifferentGroup.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
  }

  ///Run functions on component load so data is available.
  componentDidMount() {
   this.postLogin();
   // this.getCurrentData();
  }

//Returns the mongo id for a given group name.
  getIdFromGroupName(name) {
    for (var i=0;i<this.state.user.groups.length;i++){
      if (this.state.user.groups[i].name===name){
        return this.state.user.groups[i]._id;
      } else {
        console.log('Group Id not found')
      }
    }
  }
  //Helper function to change Group.
  selectGroup(group){
    console.log('setting current group')
    this.setState({currentGroup: group});
  }
  selectDifferentGroup(){
    this.setState({currentGroup: undefined});
    //this rerenders the app to go back to option 2 (mentioned above)
  }

//Adds a new group to DB.
  postGroup(groupName){
    //this.setState({groupChosen:true});
    axios.post('/api/group', {data:{"groupName":groupName}})
      .then( response =>{
        this.addUserToGroup(this.state.user._id, response.data._id)
          .then( response => {
            
          })
          .catch( error => {
            //function ALERT ERROR. GROUP ALREADY EXISTS
            console.log('Error while adding user to group:', error);
          });
      })
      .catch(error => {
        alert('group already exists, make a new one dummy!')
        console.log('Error while adding group: ', error);
      });
  }

  addUserToGroup(userId, groupId){
    return axios.post('/api/user/' + userId + '/group', {data: {_id: groupId}})
      .then( response => {
        this.getUserData();
        return response.data;
      })
      .catch(error => {
        console.log('Error while posting user to group: ', error);
      });
  }

//Gets full list of available groups and updates state.
  getGroupsForUserId(userId){
    axios.get('/api/user/' + userId + '/group')
      .then( response => {
        this.setState( {groups:response.data.data} );
        console.log('Group State?',this.state.groups);
    })
      .catch(error => {
        console.log('Error while getting groups: ', error);
    });
  }

//Triggers FB login, then retrieves user info from DB/FB.
  getUserData(){
    axios.get('/api/user/')
      .then(response => {
        console.log('User info sucessfully retrieved', response);
        this.setState({user: response.data});
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
        if (response.data) {
          this.getUserData();
          this.setState({loggedIn: true});
        }
      })
      .catch(error => {
        console.log('Error occurred during login ', error);
      })
  }

  //postLogout sends request to server to log out user and kill session.
    //As above, may need to be updated.
  postLogout() {
    axios.post('/api/login')
      .then(response => {
        console.log('Logged out:', response);
        this.setState({loggedIn: false});
        this.getUserData();
      })
      .catch(error => {
        console.log('Error while logging out: ', error);
      })
  }

  //There are three possible options when we reach the home page.
//For each option a navbar is rendered regardless of state.
//1. LoggedIn is false -> render the Landing page component.
//2. LoggedIn is true but group chosen is false -> render the groups component.
//3. LoggedIn is true and groups chosen is true -> render the Volunteer button and volunteer component
// (Which in turn, will render the request component(s))

  render() {
    if (this.state.loggedIn===false){
      return (
        <div>
          <div className='nav-bar'></div>
          <LandingPage />
        </div>
        )
    } else {
      if (this.state.currentGroup === undefined){
        return (
          <div>
          <NavBar
          loggedIn={true}
          postLogout={this.postLogout.bind(this)}
          postLogin={this.postLogin.bind(this)}
          user={this.state.user} />
          <div className='greeting'> Hi, {this.state.user.userName}.</div>
          <div className='group-select yellow-font'>Please select a group.</div>
            {this.state.user.groups.map(group =>
              //This maps out all the groups into a list.
              <Groups
                selectGroup={this.selectGroup.bind(this)}
                //If I don't put a key in, react gets angry with me.
                key={Math.random()}
                group={group} />
            )}
            <div className='center'>
              <GroupModal postGroup={this.postGroup.bind(this)}/>
            </div>
            <div className='center'>
              <JoinGroupModal addUserToGroup={this.addUserToGroup.bind(this)} userId={this.state.user._id}
              />
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
              user={this.state.user}  />
            <VolunteerRequestsContainer
              user={this.state.user}
              group={this.state.currentGroup}
              //We pass down the selectDifferentGroup function to this component since the button is rendered there
              selectDifferentGroup={this.selectDifferentGroup}
              selectGroup={this.selectGroup} />
          </div>
          )
        }
    }
  }
};


export default App;
