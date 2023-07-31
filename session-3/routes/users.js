var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
// get config vars
dotenv.config();


/* GET users listing. */
router.get('/', async(req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, type } = req.body;

  try {
    const user = new User({ name, email, type });
    user.password = "abc";
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, email, type } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { name, email, type }, { new: true });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post('/token', async (req, res, next) => {
  if(userExist(req.body.name)){
    const token = generateAccessToken({ username: req.body.username });
    res.json(token);
  }else{
    res.status(400).send("User not found");
  }
 
});

router.post('/auth', authenticateToken ,async (req, res, next) => {
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
