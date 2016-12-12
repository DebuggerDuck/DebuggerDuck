var React = require('react');

const SMSButton = ({sendSMS}) => {
  return (
    <div className='center'>
      <button className='red-button new-group' onClick={() => sendSMS()}>Text me the list, right now!</button>
    </div>
  );
};

module.exports = SMSButton;