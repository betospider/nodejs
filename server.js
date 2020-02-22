require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cors())
//app.use(cors)

/*app.use(function (req,res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})*/







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
app.listen(3000)