const {generateAccessToken, generateRefreshToken} = require('../../../middleware/tokenGeneration');
export default handler;

function handler(req, res) {
    switch (req.method) {
        case 'GET':
          const { user } = req;
          const userResponse =  user ? {
            email: user.email,
            name: user.name,
            _id: user._id,
            accessToken: generateAccessToken(),
            refreshToken: generateRefreshToken(), 
          } : {};
          res.status(200).json({ user: userResponse })
          break;
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}