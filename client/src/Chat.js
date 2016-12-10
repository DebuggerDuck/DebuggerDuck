import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Message from './message.js'

class Chat extends Component {
  constructor(props) {
    super(props);
    console.log('prrrrrrrrrro', this.props)
    var socket = io();
    socket.emit('createRoom', this.props.group._id)
    socket.on('addMessage', function(mess) {
      console.log(mess)
    })
    this.state = {
      messages: []
    };

    this.getChatForGroupId = this.getChatForGroupId.bind(this);
    this.getChatForGroupId(this.props.group._id);
  }

  getChatForGroupId(groupId) {
    axios.get('/api/group/'+groupId+'/cats')
      .then(response => {
        console.log('Getting Current Data?', response.data.data);
        this.setState({volunteers: response.data.data});
      })
      .catch(error => {
        console.log('Error while getting current data: ', error);
      })
  }


  submitChat() {
    console.log('askjdflksdf')
  }

  render() {
    return (
    <div className="col-md-6">
      <div className="messages">
        {
        this.state.messages.map( (message) => <Message messageText={message.text} userName={message.user} /> )
      }
    </div>
      <form className="chatInput" method="post" action={"/api/group" + this.props.group._id + '/message'}>
        <input type="text" />
        <input onClick={this.submitChat} />
      </form>
    </div>
    )
  }

};

export default Chat;
