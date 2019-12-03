const wrap = require("./wrap");
const md5 = require('md5');

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

module.exports = (app, db) => {
    app.post('/loginUser', wrap(async (req, res) => {
        req.body.password = md5(req.body.password);
        let {email, password} = req.body;
        let newPassword = await checkPassword(app, db, password);
        console.log('newPassword2:' + newPassword);
        if (!newPassword) {
            let output = {
                status: 'NO',
                errMessage: 'Invalid Username/Password',
            };
            res.send(output);
            return;
        }

        //// routes/video.js
        // const wrap = require("../middleware/wrap");
        // router.get("/", wrap(async (req, res, next) => {
        //   let videos = await media.getAll({
        //     lang: req.getLocale(),
        //     type: 1
        //   });
        //
        //   res.render("videos", {
        //     videos
        //   });
        // }));

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
}

