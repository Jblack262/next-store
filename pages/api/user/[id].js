import dbConnect from '../../../lib/dbConnect'
import UserSchema from '../../../lib/models/user.js';
console.log(UserSchema)
// const UserSchema = require('../models/user');

export default async function handler(req, res) {
    const { method } = req
  
    await dbConnect()
  
    switch (method) {
    case 'GET':
          
        try {
            const user = await UserSchema.findById(req.query.id).exec();
            res.status(201).json({ user });
        } catch (error) { res.status(500).json({ msg: `an error has occurred: ${error}` }) }
        break

    case 'PATCH':

        try {
            const { id } = req.query;
            const user = req.body;
            await UserSchema.findOneAndUpdate({ _id: id }, user);
            res.status(201).json({ user });
        } catch (error) {
            res.status(500).json({msg: `an error has occurred: ${error}` })
        }
        break

    case 'DELETE':
  
        try {
            await UserSchema.findByIdAndRemove(req.query.id);
            res.status(201).json({ success: true, message: `user with id ${req.query.id} deleted` });
        } catch (error) { res.status(500).json({ msg: `an error has occurred: ${error}` }) }
        break

    default:

        res.status(400).json({ success: false })
        break
    }
}