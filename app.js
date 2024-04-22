const express=require('express');
const app=express();
require('dotenv').config();

const path=require('path');
const cors=require('cors');
const fs=require('fs');
const adminRoutes=require('./routes/adminRoutes');

// const session = require('express-session');

app.use(cors());
app.use(express.static('./public'));
// console.log("in app.js")


app.use(express.json());
app.use('/admin',adminRoutes);

const sequelize=require('./util/db');
sequelize.sync().then(
    ()=>{
        app.listen(3000,()=>{
            console.log('Server started on port 3000');
        })
    }
).catch(e=>console.log(e));
