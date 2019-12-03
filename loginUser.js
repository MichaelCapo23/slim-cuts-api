const wrap = require("./wrap");
const md5 = require('md5');
const nodeFns = require('./nodeFns');

module.exports = (app, db) => {
    app.post('/loginUser', wrap(async (req, res) => {
        req.body.password = md5(req.body.password);
        let {email, password} = req.body;
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
        let sql = "SELECT `token` FROM `accounts` WHERE `email` = ? AND `password` = ?";
        db.connect(() => {
            db.query(sql, [email, password], (err, data) => {
                if (!err) {
                    let output = {
                        status: "NO",
                        errMessage: 'Invalid Username/Password'
                    };
                    if (data.length > 0) {
                        output = {
                            status: "OK",
                            token: data[0].token
                        };
                    }
                    res.send(output);
                } else {
                    console.log(err);
                }
            })
        });
    }));
};

