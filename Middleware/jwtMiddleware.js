const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log('Inside JWT Middleware');
    console.log('Headers received:', req.headers);

    if (!req.headers['authorization']) {
        console.log('Authorization header is missing');
        return res.status(404).json("Authorization failed. Token is missing!!!");
    }

    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        console.log('Invalid Authorization format');
        return res.status(400).json("Invalid Authorization format");
    }

    const token = tokenParts[1].trim();
    console.log('Extracted Token:', token);

    console.log('JWT Secret:', process.env.JWTPASSWORD);

    if (!process.env.JWTPASSWORD) {
        return res.status(500).json("Server error: JWT Secret is missing");
    }

    try {
        const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
        console.log('Decoded JWT:', jwtResponse);
        req.user = {
            userId: jwtResponse.userId,
            role: jwtResponse.role,
            userIdTag: jwtResponse.userIdTag
          };
                  next();
    } catch (err) {
        console.log('JWT Verification Failed:', err.message);
        return res.status(401).json("Authorization failed....Please login again");
    }
};

module.exports = jwtMiddleware;
