module.exports = (app, db) => {
    app.post('/getUsername', (req, res) => {
        let {token} = req.body;
        let sql = "SELECT `name`, `username` FROM `accounts` WHERE `token` = ?";
        db.connect(() => {
            db.query(sql, token, (err, data) => {
                if (!err) {
                    let output = {
                        status: "NO",
                        errMessage: 'Unable to get Data'
                    };
                    if (data.length > 0) {
                        output = {
                            status: "OK",
                            username: data[0].username,
                            name: data[0].name
                        }
                    }
                    res.send(output)
                } else {
                    console.log(err)
                }
            })
        })
    });
};