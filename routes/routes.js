const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('./../auth/auth');
const logger = require('../utility/logger');

router.post('/register', (req, res) => {
    auth.register(req, res)
})

router.post('/login', async (req, res, next) => {
      passport.authenticate('login', async (err, user, info) => {
       try {
            if (err || !user) {
              logger.error("Error in login", err);
              const error = new Error('An error occurred.');               
              return next(error);
            }
  
            req.login( user, { session: false }, async (error) => {
                if (error) {
                    logger.error("Error in login", error); 
                    return next(error);
                }
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, 'TOP_SECRET');  
                return res.json({"token": token, "user": user });
              }
            );
          } catch (error) {
            logger.error("Error in login", error);
            return next(error);
          }
        }
      )(req, res, next);
    }
  );

module.exports = router;
