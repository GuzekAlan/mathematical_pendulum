const {verify} = require('jsonwebtoken');
const {Router, static} = require('express');
const {StatusCodes} = require('http-status-codes');
const {resolve} = require('path');

const router = Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

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


const authorization = (req, res, next) => {
    res.locals.auth = false;
    try{
        const token = req.cookies['access_token'];
        if(token) {
            const data = verify(token, accessTokenSecret);
            res.locals.auth = true;
            res.locals.username = data.username;
        }
    } catch (error) {
        console.log(error);
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