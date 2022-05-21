const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('../lib/models/user');

module.exports = function (passport) {
    //Serialization + deserialization for simultaneous logins
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            const lowercaseEmail = email.toLowerCase();
            console.log(lowercaseEmail);
            User.findOne({ email: lowercaseEmail })
                .then((user) => {

                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }

                    //match pass
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