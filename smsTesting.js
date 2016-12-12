var AWS = require('aws-sdk');
var sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  region: 'us-east-1',
  accessKeyId: require('./config').aws.accessKeyId,
  secretAccessKey: require('./config').aws.secretAccessKey,
});

function textList(nums, message){
  for (var i = 0; i < nums.length; i++) {
    var params = {
      Message: message, /* required */
      PhoneNumber: nums[i],
    };
    sns.publish(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  }
}

// var params = {
//   Protocol: 'sms', /* required */
//   TopicArn: 'arn:aws:sns:us-east-1:389655434317:grabMeACroissant', /* required */
//   Endpoint: '+15122280163',
// };
// sns.subscribe(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


// var params = {
//   Token: 'arn:aws:sns:us-east-1:389655434317:grabMeACroissant:6e1c5f2d-7110-45b1-a51a-87a5f9518e4f', /* required */
//   TopicArn: 'arn:aws:sns:us-east-1:389655434317:grabMeACroissant', /* required */
//   // AuthenticateOnUnsubscribe: 'STRING_VALUE'
// };
// sns.confirmSubscription(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// var nums = ['+13174371839',
// '+17036748634',
// '+15129216293']

// var params = {
//   Message: 'Muah!', /* required */
//   PhoneNumber: '+15123511480',
// };
// sns.publish(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });