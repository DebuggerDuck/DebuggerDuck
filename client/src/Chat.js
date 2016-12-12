import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const io = require('socket.io-client');
const socket = io()

import Message from './message.js'

class Chat extends Component {
  constructor(props) {
    super(props);
    console.log('prrrrrrrrrro', this.props)
    this.state = {
      messages: [],
      socket: socket
    };
    this.getChatForGroupId(this.props.group._id);
    // this.getChatForGroupId(this.props.group._id);
  }

  getChatForGroupId(groupId) {
    axios.get('/api/group/' + groupId).then(response => {
      console.log('MESSAGES FROM CHAT.JS', response.data.data[0].messages);
      this.setState({messages: response.data.data[0].messages});
    }).catch(error => {
      console.log('ERROR MESSAGES GET FROM CHAT.JS', error);
    })
  }

  addMessageFn(mess) {
    var temp = this.state.messages.slice()
    temp.push(mess)
    this.setState({'messages': temp})
  }

  submitMessage(event) {
    this.state.socket.emit('addMessage', {
      roomId: this.props.group._id,
      user_id: this.props.user._id,
      userName: this.props.user.userName,
      picture: this.props.user.picture,
      text: $('.chatBox input').val()
    })
    // console.log('PROPS:', this.props)
    event.preventDefault();
    axios.post('api/group/' + this.props.group._id + '/message', {
      data: {
        user_id: this.props.user._id,
        userName: this.props.user.userName,
        picture: this.props.user.picture,
        text: $('.chatBox input').val()
      }
    }).then(response => {}).catch(error => {
      console.log('Error while posting message: ', error);
    });
    $('.chatBox input').val('');
    this.props.selectGroup(this.props.group._id);
  }

  componentDidMount() {
    this.state.socket.emit('createRoom', this.props.group._id)
    this.state.socket.on('addMessage', this.addMessageFn.bind(this))
  }

  render() {
    this.state.socket.emit('createRoom', this.props.group._id)
    return (
      <div className="chatBox">
        <div className="messagesBox">
          {this.state.messages.map((message) => <Message text={message.text} userName={message.userName}/>)
}
        </div>
        <div className="inputBox">
          <input type="text" className="text"/>
          <input type="button" value="Send Message" onClick={function() {
            return this.submitMessage(event)
          }.bind(this)}/>
        </div>
      </div>
    )
  }

};

export default Chat;
