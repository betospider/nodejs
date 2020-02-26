const express = require('express')
const mysql = require('mysql')

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
const app = express()

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

app.get('/addPost1', (req, res) => {

    let post = {title: 'post 1', body: 'this is the actual title body for post  1'};
    let sql = 'INSERT INTO posts SET ?';
   // onnection.query('INSERT INTO messages VALUES ?', post, function(err, result) {

    let query = db.query(sql, post, (err, result) => {
 
            if(err) throw err;
            console.log(result);
            res.send('posts table updated');
        })
  
    })


app.listen('3000', () => {

    console.log("server started at port 3000");
})