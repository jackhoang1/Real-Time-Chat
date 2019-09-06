import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";

//run evn
require('dotenv').config();

//init app
let app = express();

//Set max connection event listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

//connect to DB
ConnectDB();

//Config session
session.config(app);

//Config view Engine
configViewEngine(app);

//Enable flash
app.use(connectFlash());

//user cookie parser
app.use(cookieParser());

// Enable post data for request
app.use(bodyParser.urlencoded({extended:true}));

//Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Init all routes
initRoutes(app);

//Config for socket.io
configSocketIo(io, cookieParser, session.sessionStore);

//Init all sockets
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, ()=>{
    console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
});




// import pem from "pem";
// import https from "https";

// pem.config({
//     pathOpenSSL: 'C:\\Program Files\\OpenSSL-Win64\\bin\\openssl'
// })
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }

// //run evn
// require('dotenv').config();

// //init app
// let app = express();

// //Set max connection event listener
// events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

// //Init server with socket.io & express app
// let server = http.createServer(app);
// let io = socketio(server);

// //connect to DB
// ConnectDB();

// //Config session
// session.config(app);

// //Config view Engine
// configViewEngine(app);

// //Enable flash
// app.use(connectFlash());

// //user cookie parser
// app.use(cookieParser());

// // Enable post data for request
// app.use(bodyParser.urlencoded({extended:true}));

// //Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// //Init all routes
// initRoutes(app);

// //Config for socket.io
// configSocketIo(io, cookieParser, session.sessionStore);

// //Init all sockets
// initSockets(io);
    
//     https.createServer({ 
//         key: keys.serviceKey, 
//         cert: keys.certificate }, app)
//         .listen(process.env.APP_PORT, process.env.APP_HOST, ()=>{
//         console.log(`Server is running on ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
//     });
// });
