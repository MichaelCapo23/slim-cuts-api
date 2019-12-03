const md5 = require('md5');

module.exports = (app, db) => {
    app.post('/addAccount', (req, res) => {
        let {name, password, email, username} = req.body;
        checkPassword(app, db, password).then(newPassword => {
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
        });
    });
};

const checkPassword = async (app, db, password) => {
    password = md5(password);
    let sql = "SELECT COUNT(*) AS rows FROM `accounts` WHERE `password` = ?";
    db.connect(() => {
        db.query(sql, password, (err, data) => {
            if (!err) {
                let newPassword = false;
                let rows = data[0].rows;
                if (!rows) {
                    newPassword = true;
                }
                console.log('newPassword:' + newPassword);
                return newPassword;
            } else {
                console.log(err);
                return false;
            }
        })
    })
}