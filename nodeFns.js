const md5 = require('md5');

const checkPassword  =  (password) => {
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

module.exports.checkPassword = checkPassword;