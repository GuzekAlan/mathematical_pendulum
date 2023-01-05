const {Router, json, urlencoded} = require('express');
const {StatusCodes, getReasonPhrase} = require('http-status-codes');
const {sign, verify} = require('jsonwebtoken');
const db = require('./dbClient');

const collection = db.db(process.env.DATABASE_NAME).collection(process.env.DATABASE_COLLECTION);
const router = Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

router.use(json());
router.use(urlencoded({extended: true}));

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const users = await collection.find({"username": username}).toArray();
    if(users.length) {
        if(password === users[0].password) {
            const accessToken = sign({"username": username}, accessTokenSecret, {expiresIn: '5m'});
            const refreshToken = sign({"username": username}, refreshTokenSecret, {expiresIn: '1d'});
            return res
                .cookie('accessToken', accessToken, {
                    httpOnly: true,
                    maxAge: 5*60*1000
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 24*60*60*1000
                })
                .status(StatusCodes.OK)
                .json({});
        }
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: "Błędne hasło"});
    }
    return res
        .status(StatusCodes.BAD_REQUEST)
        .json({error: "Nie ma takiego użytkownika"});
});

router.post('/register', async (req, res) => {
    const {username} = req.body;
    const users = await collection.find({"username": username}).toArray();
    if(users.length){
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: `Podany użytkownik ${username} już istnieje`});
    }
    await collection.insertOne(req.body);
    return res
        .status(StatusCodes.OK)
        .json({});
});

router.get('/logout', (req, res) => {
    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .redirect("/")
        .end();
});

module.exports = router;