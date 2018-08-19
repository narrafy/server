const express = require('express')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../../service/config')
const passport = require('passport')
const router = express.Router()

router.post('/register', passport.authenticate('register', {session: false}), async (req, res, next) => {
    res.json({
        message: 'Register successful',
        user: req.customer
    })
})

router.post('/login', async (req, res, next) => {

    passport.authenticate('login', async (err, customer, info) =>{
        try{
            if(err || !customer) {
                const error = new Error(info.message);
                return next(error)
            }
            req.login(customer, {session: false}, async(error)=>{

                if(error) return next(error)

                //do not store sensitive information in jwt tokens
                const body = {
                    email: customer.email,
                    workspace: customer.config.config.conversation.workspace,
                    access_token: customer.config.config.facebook.access_token
                }
                //sign the jwt token and load the payload with customer info
                const token = jwt.sign({customer: body}, jwtConfig.secret, {expiresIn: '10d'})
                //send the token back
                return res.json({token})
            })
        }catch (error) {
            return res.json(error)
        }
    })(req, res, next)
})

router.get('/me', passport.authenticate('jwt', { session : false }), (req, res, next) => {

    res.json({
        message : 'You made it to the secure route',
        customer : req.customer,
        token: req.token
    })
})

module.exports = router