const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const { validateEmail, validatePhone, validateOtp } = require('../util/validators');

class AuthController {
    async sendOtp(req, res) {
        const { phone, email } = req.body;
        const phoneEmail = phone || email;

        if(!phoneEmail){
            return res.status(400).json({message: 'Phone no. or email is required!'})
        }

        // Validate email or phone format
        if (email && !validateEmail(email)) {
            return res.status(400).json({message: 'Invalid email format'})
        }

        if (phone && !validatePhone(phone)) {
            return res.status(400).json({message: 'Invalid phone format'})
        }

        const otp = await otpService.generateOtp();     
        const ttl = 1000 * 60 * 5;
        const expires = Date.now() + ttl;
        const data = `${phoneEmail}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // Log OTP for debugging/testing
        console.log(`📧 OTP requested for: ${phoneEmail}`);
        console.log(`🔐 Generated OTP: ${otp}`);

        try{
            if (email){
                const emailSent = await otpService.sendByMail(email, otp);
                if (emailSent) {
                    console.log(`✅ OTP sent successfully to ${email}`);
                } else {
                    console.log(`⚠️  Email failed but OTP logged for: ${email}`);
                }
            }else {
                // await otpService.sendBySms(phone, otp);
            }

            const response = {
                hash: `${hash}.${expires}`,
                phone,
                email,
                message: 'OTP sent successfully! Check your email.'
            };

            // In development/testing, include OTP in response for easier testing
            if (process.env.NODE_ENV === 'development') {
                response.otp = otp; // For local testing
                response.debug = true;
            }

            return res.status(200).json(response);
        }
        catch(err){
            console.error('❌ Error in sendOtp:', err);
            return res.status(500).json({message: 'Message sending failed'})
        }
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone, email } = req.body;
        const phoneEmail = phone || email;

        if(!otp || !hash || !phoneEmail){
            return res.status(400).json({message: "All fields are required!"});
        }

        // Validate OTP format
        if (!validateOtp(otp)) {
            return res.status(400).json({message: "Invalid OTP format"});
        }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            return res.status(400).json({message: 'OTP expired!'});
        }

        const data = `${phoneEmail}.${otp}.${expires}`;   
        const isValid = otpService.verifyOtp(hashedOtp, data);
        
        if(!isValid) {
            return res.status(400).json({message: "Invalid OTP"})
        }

        let user;

        try {
            user = await userService.findUser({email, phone});
            if(!user) {
                user = await userService.createUser({email, phone});
            }
        } catch(err){
            console.log(err);
            return res.status(500).json({ message: 'Db Error'})
        }

        // Ensure user exists before proceeding
        if (!user) {
            return res.status(500).json({ message: 'Failed to create/find user'});
        }

        let accessToken, refreshToken;
        try {
            const tokens = tokenService.genrateTokens({_id: user._id, activated: user.activated});
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        } catch(err) {
            console.log(err);
            return res.status(500).json({ message: 'Token generation failed'});
        }

        if (!refreshToken) {
            return res.status(500).json({ message: 'Failed to generate refresh token'});
        }

        try {
            await tokenService.storeRefreshToken(refreshToken, user._id);
        } catch(err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to store refresh token'});
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        return res.json({ user: userDto, auth: true });

    }

    async refresh(req, res){
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        // check if token is valid
        let userData;
        try{
            userData =  await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        }catch(err) {
            return res.status(401).json({message: "Invalid Token"});
        }

        // Check if token is in db
        try{
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
            if(!token){
                return res.status(401).json({message: "Invalid Token"});
            }

        }catch(err) {
            return res.status(500).json({message: "Internal Error"});
        }

        // Check if valid user
        const user = await userService.findUser({_id: userData._id});
        if(!user){
            return res.status(404).json({message: "No User"});
        }

        // genrate new tokens
        const { refreshToken, accessToken } = await tokenService.genrateTokens({_id: userData._id });

        // Update refresh token 
        try{
           await tokenService.updateRefreshToken(userData._id, refreshToken)
        }catch(err){
            return res.status(500).json({message: "Internal Error"});
        }

        // put in cookie        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        // response send 
        const userDto = new UserDto(user);
        return res.json({ user: userDto, auth: true });

    }

    async logout(req, res){
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({message: 'No token to logout'});
        }

        // delete refresh token from db
        try {
            await tokenService.removeToken(refreshToken);
        } catch(err) {
            console.log(err);
            return res.status(500).json({message: 'Logout failed'});
        }

        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.json({user: null, auth: false})

    }

}

module.exports = new AuthController();