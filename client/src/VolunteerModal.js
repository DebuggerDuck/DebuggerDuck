import React from 'react';

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
    };
  }
  
  onSubmit (){

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
        <div>
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
                <input className='modal-input' type="text" id="location"/>
              </div>
              <div>
                &nbsp; What time? &nbsp;
                <input className='modal-input second-input' type="text" id="time"/>
              </div>
            </div>
            <ModalFooter>
              <button className="red-button" onClick={this.hideModal.bind(this)}>
                Submit
              </button>
            </ModalFooter>
          </Modal>
        </div>
    );
  }
}

export default VolunteerModal;