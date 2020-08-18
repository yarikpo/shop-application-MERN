const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

// example data
const profiles = [
    {
        username: 'Yarik',
        password: '111',
        email: 'y@y',
    },
    {
        username: 'Boris',
        password: '222',
        email: 'b@b',
    },
    {
        username: 'Tim',
        password: '333',
        email: 't@t',
    },
];


router.get('/test', (req, res) => {
    res.send('Hello, World!');
});

// array of refresh tokens
let refreshTokens = [];

// updates access token
router.post('/token', (req, res) => {
    // receiving data from client
    const refreshToken = req.body.token;

    // checks if refresh token was passed correctly
    if (refreshToken == null) return res.sendStatus(401);
    // checks if passed token exists in refresh token's array
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    // generates and passes new access token to client
    jwt.verify(refreshToken, config.get('REFRESH_TOKEN_SECRET'), (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name, password: user.password });
        res.json({ accessToken: accessToken });
    });
});

// logouts from website
router.delete('/logout', (req, res) => {
    // deletes passed token from array of refresh tokens
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    console.log(`logout: ${req.body.token}`);
    res.sendStatus(204);
});

// logins to website
router.post('/login', (req, res) => {
    // receiving data from client
    const username = req.body.username;
    const password = req.body.password;
    console.log(`login-> username: ${username}, password: ${password}`);

    // creates user without pushing it into database
    const user = { name: username, password: password };
    // creates access token
    const accessToken = generateAccessToken(user);
    // creates refresh token
    const refreshToken = jwt.sign(user, config.get('REFRESH_TOKEN_SECRET'));
    // pushes refresh token into base with refresh tokens
    refreshTokens.push(refreshToken);
    
    // sends tokens to client
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// registers user to website
router.post('/register', (req, res) => {
    // receiving data from client
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(`register-> username: ${username}, password: ${password}, email: ${email}`);

    // cerates user without pushing to database
    const user = { username: username, password: password, email: email };
    // checks if such user exist
    if (profiles.find(item => item.username === user.username) != null) return res.json({ message: 'There is such user.' });
    // adds user to local variable
    profiles.push(user);
    res.json({ message: 'User has been created successfully' });
});

// shows personal user's information
router.get('/profile', authenticateToken, (req, res) => {
    res.json(profiles.filter(profile => profile.username === req.user.name && profile.password === req.user.password)[0] || {});
});


// creates authenticate token to give access to user
function authenticateToken(req, res, next) {
    // receives token from client
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // checks if token was received correctly
    if (token == null) return res.sendStatus(401);

    // verifies token
    jwt.verify(token, config.get('ACCESS_TOKEN_SECRET'), (err, user) => {
        // checking for errors
        if (err) return res.sendStatus(403);

        req.user = user;
        // allows user to content
        next();
    });
}

// creates access token which expires in some time
function generateAccessToken(user) {
    return jwt.sign(user, config.get('ACCESS_TOKEN_SECRET'), { expiresIn: '20s' });
}

module.exports = router;