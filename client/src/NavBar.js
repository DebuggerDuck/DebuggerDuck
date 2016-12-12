import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FacebookButton from './FacebookButton.js'
import axios from 'axios';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      isOpen: false,
      phoneEntry : '',
    };

    this.login = this.login.bind(this);
    this.logOut = this.logOut.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.submitPhoneNumber = this.submitPhoneNumber.bind(this);
  }

  //Note: Navbar does not rerender when the app renders. How can we change this??
  
  //Note: All this does is toggle loggedIn back and forth so I don't have to manually change App.js's state. 
  //Once we get OAUTH up, this button functionality will need to change.
  
  //login and logOut invoke the functions passed from App.
  login() {
    this.setState({loggedIn: true});
    console.log('Logout triggered from Navbar');
    this.props.postLogin();
   }
  //logout updates local state and runs postLogout, inherited from App. 
  logOut() {
    this.setState({loggedIn: false})
    this.props.postLogout();
  }
  openModal() {
    this.setState({
      isOpen: true
    });
  };
  hideModal() {
    this.setState({
      isOpen: false
    });
  };
  onPhoneChange(event) {
    this.setState({
      phoneEntry: event.target.value,
    })
  }
  submitPhoneNumber() {
    this.hideModal();
    axios.put('/api/user/' + this.props.user._id, {data:{"phoneNumber": this.state.phoneEntry}})
      .then( response => {
        
      })
      .catch(error => {
        console.log('Error while adding phone number:', error);
      });
  }

  render() {
    var phoneRender;
    if (this.props.user.phoneNumber) {
      phoneRender = 'Text Number:' + this.props.user.phoneNumber
    } else {
      phoneRender = <small onClick={this.openModal}>Enter you phone number for text updates</small>
    }

    let subModalDialogStyles = {
      base: {
        bottom: -600,
        transition: 'bottom 0.4s'
      },
      open: {
        bottom: 0
      }
    };
    let {isOpen, isSubOpen} = this.state;

  return ( 
    <div className='nav-bar'>
      <a href="/"><img src="/logo.png" height="60" width="333" className="logo" /></a>
      <FacebookButton 
        logOut={this.logOut} 
        loggedIn={this.state.loggedIn}/>
      <img className='nav-pic' src={this.props.user.picture}/>
      <div className='userName'>
        <div>{this.props.user.userName}</div>
        <div>{phoneRender}</div>
      </div>

      <Modal isOpen={isOpen} onRequestHide={this.hideModal}>
            <ModalHeader >
              <ModalClose onClick={this.hideModal}/>
            </ModalHeader>
            <div className='modal-inside'>
              <div>
              &nbsp; Where is your phone number? &nbsp;
                <input
                onChange={this.onPhoneChange}
                className='modal-input'
                type="text"
                id="location" />
              </div>
            </div>
            <ModalFooter>
              <button className="red-button" onClick={this.submitPhoneNumber}>
                Submit
              </button>
            </ModalFooter>
          </Modal>

  	</div>
		);
  }
};


export default NavBar;