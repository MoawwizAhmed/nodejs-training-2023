var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();


let users = [{
  'name' : 'barry',
  'role' : 'manager',
  'salary' : 400000
},
{
  'name' : 'allen',
  'role' : 'manager',
  'salary' : 600000
}]
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

router.post('/', function(req, res, next) {
  if(req.body){
    if(userExist(req.body.name)){
      userExist.role = req.body.role;
      userExist.salary = req.body.salary;
    }else{
      users.push(req.body);
    }
            
  }
  res.send(users);
});

router.delete('/', function(req, res, next) {
  if(req.body){
     if(userExist(req.body.name)){
       users = users.filter(x=> x.name !== req.body.name);
       res.send(users);
     }else{
       res.send("user does not exist.");
     }

   }
});

router.post('/token', function(req, res, next) {
  if(userExist(req.body.name)){
    const token = generateAccessToken({ username: req.body.username });
    res.json(token);
  }else{
    res.status(400).send("User not found");
  }
 
});

router.post('/auth', authenticateToken ,function(req, res, next) {
  if(userExist(req.body.name)){
    res.send("Auth is working");
  }else{
    res.status(400).send("User not found");
  }
 
});


function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function userExist(name){
  const userExist =  users.find(x=>{
    return x.name === name
 });
 return userExist;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports = router;
