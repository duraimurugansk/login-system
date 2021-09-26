const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const router = require('./routes/userRouter')
const cors = require('cors')
dotenv.config();
const port = process.env.PORT||4000;
const app = express();

app.use(express.json())
app.use(cors())
// database connection
mongoose.connect(process.env.MONGO_URL,(err)=>{
    if(err)throw err
    console.log("db connected");
})

app.use('/',router)   

    app.listen(port,()=>{
        console.log(`server listening....${port}`);
    })
