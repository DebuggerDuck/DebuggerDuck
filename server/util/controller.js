const db = require('../db/schemas.js');
const sms = require('../db/sms.js')

// Returns an object with a key of data
const buildResObj = function (data) {
  return {
    data: data
  }
}

module.exports = {

  user: {
    get: (req, res) => {
      db.User.findOne({fb_id: req.user.id})
        .populate('groups')
        .then((user) => {
          res.status(200).send(user);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(400);
        })
    },
    put: (req, res) => {
      console.log('update user', req.params.userId, 'with', req.body.data)
      db.User.update({_id: req.params.userId}, req.body.data)
        .then((user) => {
          console.log('after update', user);
          res.sendStatus(201);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(400);
        })
    },
    loggedIn: (req, res) => {
      if (req.user !== undefined){
        if (req.user.id) {
          res.send(true);
        }
      } else {
        res.send(false)
      }
    },
    logout: (req, res) => {
      req.session.destroy();
      res.redirect('/');
    },
    group: {
      get: (req, res) => {
        db.User.findOne({_id: req.params.userId})
          .populate('groups')
          .then((user) => {
            res.status(200).send(buildResObj(user.groups));
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(400);
          })
      },
      post: (req, res) => {
        Promise.all([
        db.User.findById({_id: req.params.userId})
          .then((user) => {
            user.groups.push(req.body.data)
            return user.save()
              .then ((user) => {
                return user;
              })
          }),
        db.Group.findById({_id: req.body.data._id})
          .then((group) => {
            group.users.push(req.params.userId)
            return group.save()
              .then ((group) => {
                return group;
              })
          })])
          .then ((response) => {
            console.log(response)
            res.sendStatus(201)
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(400);
          })
      },
    },
  },

  group: {
    // Group controller functions for GET
    get: (req, res) => {
      db.Group.find({_id: req.params.groupId}).exec()
        .then((group) => {
          let response = buildResObj(group);
          res.status(200).send(response);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(400);
        })
    },

    delete: (req, res) => {
      db.Group.findByIdAndRemove({_id: req.query.id})
      .then((user) => {
        res.status(200).send('the group is dead.')
      })
      .catch((err) => {
            console.error(err);
            res.sendStatus(400);
          })
    },

    // Group controller functions for GET
    post: (req, res) => {
      // Look in the database to see if there is a Group with the given name already
      db.Group.findOne({name: req.body.data.groupName}).exec()
      .then((data) => {
        // If we don't get any data, add the request body into the database
        if(!data) {
          new db.Group({name: req.body.data.groupName}).save()
          .then((data) => {
            // Send a 201 status that it was completed
            res.status(201).send(data);
          })
          // Catch the error and log it in the server console
          .catch((err) => {
            console.error(err);
            res.sendStatus(400);
          })
        }
        else {
          // Send a 401 status and a message that the group is already added the database
          res.status(401).send('Group is already in the database.')
        }
      })
      .catch((err) => {
        console.log(err);
      })
    },
    volunteer: {
      get: (req, res) => {
        db.Order.find({ group_id: req.params.groupId })
          .then((volunteers) => {
            let response = buildResObj(volunteers);
            res.status(200).send(response);
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(400);
          })
      },
    },

    postMessage: (req, res) => {
      db.Group.findById({_id: req.params.groupId})
      .then((group) => {
            group.messages.push(req.body.data)
            group.save()
            .then((group) => {
            console.log('Message saved to group in DB.', data);
            res.status(201);
          })
      .catch((err) => {
        res.sendStatus(400)
      })
    })
  },

  postText: (req, res) => {
    sms.send(req.body.data.nums, req.body.data.message, function(err, data){
      if (err) {
        res.status(400).send(err)
        console.log(err, err.stack); // an error occurred
      } else {
        res.status(201).send(data)
        console.log(data);           // successful response
      }
    })
  }
},

  volunteer: {
    // Volunteer controller functions for GET
    get: (req, res) => {
      db.Order.find().exec()
        .then((volunteers) => {
          let response = buildResObj(volunteers);
          res.status(200).send(response);
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(400);
        })
    },
    // Volunteer controller functions for POST
    post: (req, res) => {
      new db.Order({
        orderer_userName: req.body.data.orderer_userName,
        location: req.body.data.location,
        time: req.body.data.time,
        picture: req.body.data.picture,
        group_id: req.body.data.groupId,
        requests: req.body.data.requests
      }).save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(400).send(err);
      })
    }
  },

  request: {
    // Request controller functions for POST
    //Data is posted in req.body
    post: (req, res) => {
      db.Order.findById({_id: req.body.data.volunteerId})
        .then((order) => {
          var updated = false;
          order.requests = order.requests.map(request => {
            if (request.user_id === req.body.data.user_id) {
              request.text = req.body.data.text;
              updated = true;
            }
            return request;
          })
          if (!updated) {
            order.requests.push({
              userName: req.body.data.userName, 
              user_id: req.body.data.user_id, 
              picture: req.body.data.picture, 
              text: req.body.data.text,
            })
          }
          order.save()
            .then( (order) => {
              res.status(201).send(order)
            })
        })
        .catch((err) => {
          console.log('return error', err)
          res.sendStatus(400)
        })
      //console.log('Request POST', req);

   }
},

  logout: {
    get: (req, res) => {
      res.sendStatus(200);

     }
   },

}
