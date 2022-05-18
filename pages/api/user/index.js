import dbConnect from '../../../lib/dbConnect';
import UserSchema from '../../../lib/models/user.js';

const bcrypt = require('bcrypt');

export default async function handler(req, res) {
    const { method } = req
  
    await dbConnect()
  
    switch (method) {
    case 'GET':
          
        try {
            const users = await UserSchema.find({});
            res.status(201).json({ users });
        } catch (error) { res.status(500).json({ msg: error }) }
        break

    case 'POST':

        
        const { email, name, password } = req.body;
        console.log(req.body)
        try {
            // const salt = await bcrypt.genSalt(10)
            // console.log(`Salt ${salt}`);

            UserSchema.findOne({ email: email }).exec((err, user) => {
                const lowercaseEmail = email.toLowerCase();
                if (user) {
                    console.log('username already in use');
                    res.status(409).json({ error: "email already registered"})
                } else {
                    const newUser = new UserSchema({
                        email: lowercaseEmail,
                        name: name,
                        password: password
                    })

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt,
                            (err, hash) => {
                                if (err) throw err;
                                //same pass to hash
                                newUser.password = hash;
                                //save user

                                newUser.save()
                                    .then((value) => {
                                        console.log(value)
                                        // req.flash('success_msg', 'You have now registered')
                                        res.status(200)
                                    })
                                    .catch(value => console.log(value))
                            }
                        )
                    )
                }
            })
        } catch (error) {
            console.error(error)
        }
        break

    case 'DELETE':
  
        try {
            await UserSchema.deleteMany({});
            res.status(201).json({ success: true, message: "all users deleted" });
        } catch (error) { res.status(500).json({ msg: error }) }
        break

    default:

        res.status(400).json({ success: false })
        break
    }
}