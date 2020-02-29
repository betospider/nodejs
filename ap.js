require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const jwt = require("jsonwebtoken")


app.use(express.json())
app.use(cors())

const posts = [
    {
        username: 'Kyle', 
        title: 'Post 1'
    },
    {
        username: 'Beto', 
        title: 'Post 2'
    }
]
app.get('/posts', authenticateToken, (req, res, next) =>{
   
    res.json(posts.filter(post => post.username === req.user.name));
    next();
})

app.post('/login', (req, res) =>{
    const username = req.body.username
    const user = {name: username}
    // create web token, and serialize it
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    // accessTokem saves the user information safely
    res.json({accessToken: accessToken})
})

// create connection
const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password    : '',
    database    : 'nodemysql'
})

// Connect
db.connect((err) =>{
    if(err){
        throw err;
    }
    console.log('Mysql connected ....');
})


// Create DB
app.get('/createdb', (req, res) =>{
    let sql='CREATE DATABASE nodemysql';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Database Created');

    });

});

app.get('/createpoststable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255),body VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('posts table created');
    })

})

app.get('/addPost1', authenticateToken, (req, res) => {

    let post = {title: 'post 1', body: 'saxophone added'};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
 
            if(err) throw err;
            console.log(result);
            res.send('posts table updated');
        })
  
})

// it posts , and if username is correct creates token
// No authentication at this point. Just the returning token
app.post('/token', (req, res) =>{
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)

    res.json({accessToken: accessToken})
})

//authenticate token
function authenticateToken(req, res, next){
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token==null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
 }



app.listen('3000', () => {

    console.log("server started at port 3000");
})