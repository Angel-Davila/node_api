const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const body = require("body-parser")
const app = express();
const protectedRoute = express.Router();
const postModels = require("./models/posts")
const postRouter = require("./routes/post")
let port = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost:27017/testDB').then(() => {
  console.log("Database Connection Succesful");

}).catch(() => {
  console.log("Database Connection Failed");

})

app.set("key", "secret")

protectedRoute.use((req, res) => {
  const token = req.headers["access-token"];

  if (token) {
    jwt.verify(token, app.get("key"), (err, decoded) => {
      if (err) {
        return res.send(
          {
            "msg":"invalid token"
          }
        )
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send(
      {
        "msg":"token not provided"
      }
    )
  }
});


app.use(express.json());
app.use(cors());

app.use("/api/postRouter", postRouter);

app.all('*', function(req, res, next){
  
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers","Content-Type");
  next();
});

app.get('/api/get', function(req,res){
  res.send(
    {
      msg:'hello',
      content: 'this is a message'
    });
});

app.post('/api/post', function(req, res){
    let body = req.body;
    res.send({
      nombre:body.nombre,
      apellido:body.apellido,
      message: "body created"
    }); 
})

app.put('/api/put', function(req, res){
  let body = req.body;
  res.send({
    nombre:body.nombre,
    apellido:body.apellido,
    message: "body updated"
  }); 
})

app.delete('/api/delete', (req, res) => {
  res.send({
    message: "body deleted"
  })
})

app.listen(port, function(){
  console.log('server status: RUNNING')
});