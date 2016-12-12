var React = require('react');

const BackButton = ({viewOrders}) => {
  return (
    <div className='center'>
      <button className='red-button new-group' onClick={() => viewOrders()}>Back</button>
    </div>
  );
};

module.exports = BackButton;
