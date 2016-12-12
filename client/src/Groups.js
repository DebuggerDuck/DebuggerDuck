import React, {Component} from 'react';

class Groups extends Component {
   constructor(props) {
    super(props);
    console.log('group:', this.props.group)
  }
  sendGroupToApp() {
    this.props.selectGroup(this.props.group);
  }
   render(){
      // There's not much to this component. Technically, we could probably throw it in the app.js if we wanted to.
      return (
         <div className='group'><button key={Math.random()} onClick={this.sendGroupToApp.bind(this)} className='group-button'>{this.props.group.name}</button></div>
      )
   }
   
};

export default Groups;