const {verify, sign} = require('jsonwebtoken');
const {Router, static} = require('express');
const {StatusCodes} = require('http-status-codes');
const {resolve} = require('path');

const router = Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


router.use('/assets', static(resolve(__dirname, '../frontend')));


const renderBase = (req, res, next) => {
    if(res.locals.auth){
        res.locals.header_content = 'header_logged';
    }
    else{
        res.locals.header_content = 'header_unlogged';
    }
    next();
    res.render('base');
}


const authorization = async (req, res, next) => {
    res.locals.auth = false;
    try{
        const accessToken = req.cookies.accessToken;
        if(accessToken) {
            const data = verify(accessToken, accessTokenSecret);
            res.locals.auth = true;
            res.locals.username = data.username;
        } else {
            const refreshToken = req.cookies.refreshToken;
            if(refreshToken) {
                verify(refreshToken, refreshTokenSecret, (err, decoded) => {
                    if(!err) {
                        const accessToken = sign({"username": decoded.username}, accessTokenSecret, {expiresIn: '5m'});
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                            maxAge: 5*60*1000
                        });
                    }
                });
                // authorization(req, res, next);
            }
        }
    } catch (error) {
        console.log(error)
    }
    next();
}

router.use(authorization);
router.use(renderBase);

router.get('/', (req, res) => {
    res.locals.content = 'index';
});

router.get('/login', (req, res) => {
    res.locals.content = 'login';
});

router.get('/register', (req, res) => {
    res.locals.content = 'register';
});

router.get('/wiki', (req, res) => {
    res.locals.content = 'wiki';
});

router.get('/animation', (req, res) => {
    res.locals.content = 'animation';
});


module.exports = router;