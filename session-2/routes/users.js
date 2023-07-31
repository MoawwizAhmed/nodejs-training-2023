var express = require('express');
var router = express.Router();

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
   const userExist =  users.find(x=>{
       return x.name === req.body.name
    });
    console.log(userExist," user");
    if(userExist){
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
    const userExist =  users.find(x=>{
        return x.name === req.body.name
     });
     console.log(userExist," user");
     if(userExist){
       users = users.filter(x=> x.name !== req.body.name);
       res.send(users);
     }else{
       console.log("user does not exist");
       res.send("user does not exist.");
     }

   }
});

module.exports = router;
