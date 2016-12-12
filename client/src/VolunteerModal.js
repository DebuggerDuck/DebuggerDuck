import React from 'react';
import axios from 'axios';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class VolunteerModal extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isOpen: false,
      time: '',
      location: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
  }
    onTimeChange(event) {
    //every time the user types a new letter, the state is changed to the current input
    this.setState({time: event.target.value});
  }
  onLocationChange(event) {
    //every time the user types a new letter, the state is changed to the current input
    this.setState({location: event.target.value});
  }

  //postVolunteer POSTS a new volunteer to the server.
    //Accepts a location, a time, and group.  Pulls userName from state.
  postVolunteer(location, time, group) {
    axios.post('/api/volunteer', {data:{
        orderer_userName: this.props.user.userName,
        location: location,
        time:  time,
        picture: this.props.user.picture,
        groupId: this.props.group._id,
        requests: [],
      }
    })
    .then(response => {
      console.log('Volunteer posted! ',response);
      // this.getCurrentData();
      this.render();
    })
    .catch(error => {
      console.log('Error while posting Volunteer: ',error);
    });
  }

  onSubmit (){
    this.postVolunteer(this.state.location, this.state.time, this.props.currentGroup);
    this.props.onSubmit();
    this.setState({
      isOpen: false,
      time: '',
      location: '',
    });
  }

  openModal (){
    this.setState({
      isOpen: true
    });
  };

  hideModal(){
    this.setState({
      isOpen: false
    });
  };


  render() {
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
        <div className='center'>
          <button className="red-button" onClick={this.openModal.bind(this)}>
            Volunteer your services
          </button>

          <Modal isOpen={isOpen} onRequestHide={this.hideModal.bind(this)}>
            <ModalHeader >
              <ModalClose onClick={this.hideModal.bind(this)}/>

            </ModalHeader>
            <div className='modal-inside'>
              <div>
                &nbsp; Where are you going? &nbsp;
                <input
                onChange={this.onLocationChange.bind(this)}
                className='modal-input'
                type="text"
                id="location"/>
              </div>
              <div>
                &nbsp; What time? &nbsp;
                <input
                onChange={this.onTimeChange.bind(this)}
                className='modal-input second-input'
                type="text"
                id="time"/>
              </div>
            </div>
            <ModalFooter>
              <button className="red-button" onClick={this.onSubmit}>
                Submit
              </button>
            </ModalFooter>
          </Modal>
        </div>
    );
  }
}

export default VolunteerModal;
