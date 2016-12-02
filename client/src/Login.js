//Login.js displays a facebook button
import React, {Component} from 'react';

class FacebookButton extends Component {
   render(){
      return (
         <div>
      <h1> Here is a facebook button!</h1>
      <button className='.btn-primary'><i className="fa fa-facebook" aria-hidden="true"></i> Log in to facebook </button>
      </div>
      )
   }
   
};

export default FacebookButton;