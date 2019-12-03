const md5 = require('md5');

module.exports = (app, db) => {
    app.post('/loginUser', (req, res) => {
        req.body.password = md5(req.body.password);
        let {email, password} = req.body;
        // let {email, password} = req.body;
        // checkPassword(app, db, password).then(newPassword => {
        //     console.log('newPassword2:' + newPassword);
        //     if (!newPassword) {
        //         let output = {
        //             status: 'NO',
        //             errMessage: 'Invalid Username/Password',
        //         };
        //         res.send(output);
        //         return;


        let sql = "SELECT `token` FROM `accounts` WHERE `email` = ? AND `password` = ?";
        db.connect(() => {
            db.query(sql, [email, password], (err, data) => {
                if(!err) {
                    let output = {
                        status: "NO",
                        errMessage: 'Invalid Username/Password'
                    };
                    if(data.length > 0) {
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
        })
    })
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