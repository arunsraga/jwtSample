const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const userModel = require('../model/model');
const Joi = require('joi');

const logger = require('./../utility/logger')

/*
 *   Validate Register request payload
*/
const regSchema = Joi.object({ 
    username: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
})

/*
* Register new user function
*/
exports.register = async(req, res) => {   
    try {
        let userData = {    
            "username": req.body.username,
            "password": req.body.password,
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email
        } 
        const { error, value } =  regSchema.validate(userData)        
        if(error){
            logger.error("Error while register", error);
            return res.status(400).json({"error": error, "message":"Request payload validation failed"})
        }
        let isuserExist = await userModel.find({$or: [{"username":userData.username},{"email": userData.email}]})          
        
        if(isuserExist.length>0){
            logger.info("User already exist with given email or username");
            return res.status(200).json({"message":"User already exist with given email or username"})
        }
        await userModel(userData).save(); 
        logger.info("New User created Successfully and Verification mail shared successfully");
        res.status(200).json({"message": "A verification mail has been sent to your registered mail."});
    } catch (error) {
        logger.error("Error in sign up", error);
        res.status(500).json({"error":"Internal Server Error"});
    }
        
}

passport.use('login',  new localStrategy({ usernameField: 'username', passwordField: 'password'},
    async (username, password, done) => {
        try {
          const user = await userModel.findOne({ username }, {__v:0});
  
          if (!user) {
            logger.error("User not found error", username);
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await user.isValidPassword(password);
  
          if (!validate) {
            logger.error("Entered Invalid Credentials for username username : ", username);
            return done(null, false, { message: 'Invalid Credentials' });
          }
  
          logger.info("User logged in successfully");
          user.set('password', undefined, {strict: false} );
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          logger.error("Error in login", error);
          return done(error);
        }
      }
    )
);

passport.use(new JWTstrategy({ secretOrKey: 'TOP_SECRET',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')}, async (token, done) => {
        try {
            return done(null, token.user);
        } catch (error) {
            logger.error("Error in JWT Token verification", error);  
            done(error);
        }
      }
    )
)