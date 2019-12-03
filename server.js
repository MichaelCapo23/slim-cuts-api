const express = require('express');
const app = express();
// const md5 = require('md5');
const mysql_creds = require('./mysql_creds');
const mysql = require('mysql');
const db = mysql.createConnection(mysql_creds);
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '25mb'}));
app.use(express.json());
app.use(cors());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//  GET route to show the backend is hooked up
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

require('./addAccount')(app, db);
require('./loginUser')(app, db);
require('./getUsername')(app, db);







// app.post('/addAccount', (req, res) => {
//     let {name, password, email, username} = req.body;
//     checkMatchingPasswords(password).then(newPassword => {
//         console.log('newPassword2:'+newPassword);
//         if(!newPassword) {
//             let output = {
//                 status: 'NO',
//                 errMessage: 'Invalid Username/Password',
//             };
//             res.send(output);
//             return;
//         }
//
//         let cols = [];
//         let vals = [];
//         for (let [key, value] of Object.entries(req.body)) {
//             cols.push(key);
//             if(key === "password") {
//                 value = md5(value);
//             }
//             vals.push(value);
//         }
//         db.connect(() => {
//             let sql = "INSERT INTO `accounts` ("+cols+") VALUES (?)";
//             db.query(sql, [vals], (err, data) => {
//                 if(!err) {
//                     let token = md5(username + password);
//                     let output = {
//                         status: "OK",
//                         token: token
//                     };
//                     res.send(output);
//                 } else {
//                     console.log(err);
//                 }
//             })
//         })
//     });
// });
//
// async function checkMatchingPasswords(password) {
//     password = md5(password);
//     let sql = "SELECT COUNT(*) AS rows FROM `accounts` WHERE `password` = ?";
//     db.connect(() => {
//         db.query(sql, password, (err, data) => {
//             if (!err) {
//                 let newPassword = false;
//                 let rows = data[0].rows;
//                 if (!rows) {
//                     newPassword = true;
//                 }
//                 console.log('newPassword:' + newPassword);
//                 return newPassword;
//             } else {
//                 console.log(err);
//                 return false;
//             }
//         })
//     })
// };


