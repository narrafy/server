

function createUser() {

    try{
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);


        db.createUser()

        User.create({
                name : req.body.name,
                email : req.body.email,
                password : hashedPassword
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem registering the user.")

                // create a token
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });


            });


    }catch (e) {
        console.log(e.trace)
    }

}


module.exports = {

    createUser: createUser

}

