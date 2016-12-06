import React from 'react';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class RequestModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    username: 'Rubber Duck',
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
            Make a request
          </button>

          <Modal isOpen={isOpen} onRequestHide={this.hideModal.bind(this)}>
            <ModalHeader >
              <ModalClose onClick={this.hideModal.bind(this)}/>
              
            </ModalHeader>
            <div className='modal-inside'>
              <div>
                &nbsp; What would you like? &nbsp;
                <input className='modal-input third-input' type="text" id="location"/>
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

export default RequestModal;