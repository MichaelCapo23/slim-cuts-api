const md5 = require('md5');

module.exports.checkPassword = checkPassword = async (app, db, password) => {
    app.post('/checkPassword', (req, res) => {
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
                    res.send(newPassword)
                } else {
                    console.log(err);
                }
            })
        });
    })
};












// module.exports.checkPassword = checkPassword = (app, db, password, res) => {
//     password = md5(password);
//     let sql = "SELECT COUNT(*) AS rows FROM `accounts` WHERE `password` = ?";
//     db.connect(() => {
//         db.query(sql, password, (err, data) => {
//             if (!err) {
//                 let rows = data[0].rows;
//                 console.log('inside checkPassword');
//                 if (rows) {
//                     res.send('match found, invalid password');
//                 }
//             } else {
//                 res.send(err);
//                 return false;
//             }
//         })
//     });
// };




