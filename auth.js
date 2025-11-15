const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '237344975800-841jkjk3tq5090t680inm4lv9ats2o4p.apps.googleusercontent.com'; 
const client = new OAuth2Client(CLIENT_ID);

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: '인증 토큰이 누락되었거나 형식이 잘못되었습니다.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        req.user = { 
            email: payload['email'], 
            name: payload['name'] 
        }; 

             next();

    } catch (error) {
        console.error("Google ID 토큰 검증 실패:", error.message);
        return res.status(401).json({ success: false, message: '유효하지 않은 인증 토큰입니다. 다시 로그인해주세요.' });
    }
}

module.exports = authenticate;