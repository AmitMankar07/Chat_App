const express=require('express');
const app=express();
require('dotenv').config();

const bodyParser = require("body-parser");
const sequelize=require('./util/db');
const path=require('path');
const cors=require('cors');
const fs=require('fs');

//Routes
const adminRoutes=require('./routes/adminRoutes');
const chatRoutes=require('./routes/chatRoutes');
const groupRoutes=require('./routes/groupRoutes');

// const session = require('express-session');
//Models
const User = require("./models/user");
const Chat = require("./models/chats");
const Group=require('./models/group');
const UserGroup=require('./models/userGroup');

const { FORCE } = require('sequelize/lib/index-hints');

app.use(cors());
app.use(express.static('./public'));
// console.log("in app.js")


app.use(express.json());
app.use('/users',adminRoutes);
app.use('/chats',chatRoutes);
app.use('/groups',groupRoutes);

User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

sequelize.sync().then(
    ()=>{
        app.listen(3000,()=>{
            console.log('Server started on port 3000');
        })
    }
).catch(e=>console.log(e));
