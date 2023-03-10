const {verify, sign} = require('jsonwebtoken');
const {Router} = require('express');
const {StatusCodes} = require('http-status-codes');

const router = Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


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
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            const data = verify(accessToken, accessTokenSecret);
            res.locals.auth = true;
            res.locals.username = data.username;
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