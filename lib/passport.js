const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('./models/user')

module.exports = function (passport) {
    // console.log(passport)
    //Serialization + deserialization for simultaneous logins
    passport.serializeUser(function(req, user, done) {
        done(null, user.user_id);
    });
    
    
    
    passport.deserializeUser(function(user_id, done) {
        getUserInfo(user_id).then(function(user) {
            return done(null, user);
        }, function(err) {
            return done(err,null);
        });
    });

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            const lowercaseEmail = email.toLowerCase();
            User.findOne({ email: lowercaseEmail })
                .then((user) => {

                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }

                    //match pass
                    console.log(user._id)
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'password Incorrect' })
                        }
                    })
                })
                .catch((err) => { console.log(err) })
        })
    )
}