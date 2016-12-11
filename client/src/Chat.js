import React, {Component} from 'react';

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var username=this.props.username
    var orderId = this.props.orderId
    $('#chatSubmit').click(()=>{
      let msg = $('#messageForm').val()
      socket.emit('chat', {message: username+": "+msg, orderId: orderId })
      console.log("This is what was submitted as a message: ", msg)
      $('#messageForm').val('')
      return false;
    })

    socket.on('chat' + this.props.orderId, function(msg) {
      console.log("this is what a message looks like coming in:", msg);
      $('#messages').append($('<li class=chat-message>').text(msg))
    })
  }

  //save to state
   render(){
      // There's not much to this component. Technically, we could probably throw it in the app.js if we wanted to.
      return (
        <div>
          <div className="chat-window">
        		<ul id="messages" className="chat-messages">
            </ul>
          </div>
        	<form action="" className="chat-form">
        	  <input id="messageForm" autoComplete="off" /><button className="chat-button"id="chatSubmit">Send</button>
        	</form>
        </div>
      )
   }

};

export default Chat;