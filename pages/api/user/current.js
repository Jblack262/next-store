const {generateAccessToken, generateRefreshToken} = require('../../../middleware/tokenGeneration');
export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
          const { user } = req;

          if (user) {
          
            const tokenUser = { //the object that jwt will return when an authorized token is used
              email: user.email,
              name: user.name,
              // password: user.password,
              _id: user._id
            }
  
            const userResponse = {
              email: user.email,
              name: user.name,
              _id: user._id,
              accessToken: generateAccessToken(tokenUser),
              refreshToken: generateRefreshToken(tokenUser), 
            };

            res.status(200).json({ user: userResponse })

          } else {
            res.status(200).json({ user: {} })
          }
          break;
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}