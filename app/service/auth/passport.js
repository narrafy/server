const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTStrategy  = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const CustomerModel  = require('../../domain/customer/model')
const { jwtConfig } = require('../config/index')
const bcrypt = require('bcrypt')

const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
};

//define a passport strategy for register workflow
passport.use('register', new localStrategy(localOptions, async (email, password, done) =>{
    try{
        //save the information about a customer
        const customer = await CustomerModel.create(email, password)
        if(customer){
            //Send the user information to the next middleware
            return done(null, customer)
        }
        next()
    } catch (e) {
        done(e)
    }
}));

//define a passport strategy for login workflow
passport.use('login', new localStrategy(localOptions, async (email, password, done) =>{

    try{
        const customer = await CustomerModel.findOne(email)

        if(!customer)
            return done(null, false, {message: "Customer not found"})
        //validate the password
        const validate = bcrypt.compareSync(password, customer.password)
        if(!validate)
            return done(null, false, { message: 'Wrong password'})

        //send the user information to the next middleware
        return done(null, customer, {message: "Logged in successfully"})

    }catch (e) {
        done(e)
    }
}))

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtConfig.secret;

passport.use(new JWTStrategy(opts, async (token, done) => {

    try{
        return done(null, { customer: token.customer, token: token })
    }catch (e) {
        done(e)
    }
}))
