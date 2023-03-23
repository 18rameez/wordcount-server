const express= require("express");
const app = express();
const userRoute = require('./routes/user')
const wordCountRoute = require('./routes/word-count')
const {createDBConnection} = require("./util/database")
const cookieParser = require("cookie-parser");
const cors = require("cors")

require('dotenv').config()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req,res,next) => {
    res.send("welcome")
})

app.use('/api/v1', userRoute);
app.use('/api/v1/wordcount', wordCountRoute)


createDBConnection(() => {
    app.listen(4004,() => {
        console.log("server started")
    })
})
