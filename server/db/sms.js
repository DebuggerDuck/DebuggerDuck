module.exports.send = function textList(nums, message, cb){
  for (var i = 0; i < nums.length; i++) {
    var params = {
      Message: message, /* required */
      PhoneNumber: nums[i],
    };
    sns.publish(params, function(err, data) {
      cb(err,data)
      // if (err) console.log(err, err.stack); // an error occurred
      // else     console.log(data);           // successful response
    });
  }
}