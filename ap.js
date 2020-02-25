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

app.get('/createpoststable', (rq, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255),body VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('posts table created');
    })

})


app.listen('3000', () => {

    console.log("server started at port 3000");
})