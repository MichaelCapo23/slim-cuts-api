const wrap = require("./wrap");
const md5 = require('md5');
const nodeFns = require('./nodeFns');

module.exports = (app, db) => {
    app.post('/addAccount', wrap(async (req, res) => {
        let {name, password, email, username} = req.body;
        let newPassword = await nodeFns.checkPassword(app, db, password);
        console.log('newPassword2:' + newPassword);
        if (!newPassword) {
            let output = {
                status: 'NO',
                errMessage: 'Invalid Username/Password',
            };
            res.send(output);
            return;
        }

        let cols = [];
        let vals = [];
        for (let [key, value] of Object.entries(req.body)) {
            cols.push(key);
            if (key === "password") {
                value = md5(value);
            }
            vals.push(value);
        }
        db.connect(() => {
            let sql = "INSERT INTO `accounts` (" + cols + ") VALUES (?)";
            db.query(sql, [vals], (err, data) => {
                if (!err) {
                    let token = md5(username + password);
                    let output = {
                        status: "OK",
                        token: token
                    };
                    res.send(output);
                } else {
                    console.log(err);
                }
            })
        })
    }));
};


// module.exports = (app, db) => {
//     app.post('/addAccount', wrap(async (req, res) => {
//         let {name, password, email, username} = req.body;
//         await nodeFns.checkPassword(app, db, password, res);
//         console.log('after checkPassword ran');
//         let cols = [];
//         let vals = [];
//         for (let [key, value] of Object.entries(req.body)) {
//             cols.push(key);
//             if (key === "password") {
//                 value = md5(value);
//             }
//             vals.push(value);
//         }
//         db.connect(() => {
//             let sql = "INSERT INTO `accounts` (" + cols + ") VALUES (?)";
//             db.query(sql, [vals], (err, data) => {
//                 if (!err) {
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
//     }));
// };