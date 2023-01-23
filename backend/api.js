const {Router, json, urlencoded} = require('express');
const {StatusCodes, getReasonPhrase} = require('http-status-codes');
const {sign, verify} = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./dbClient');

const collection = db.db(process.env.DATABASE_NAME).collection(process.env.DATABASE_COLLECTION);
const router = Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

router.use(json());
router.use(urlencoded({extended: true}));

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await collection.findOne({"username": username});
    if(user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({error: "Błędne hasło"});
            }
            const accessToken = sign({"username": username}, accessTokenSecret, {expiresIn: '10m'});
            return res
                .cookie('accessToken', accessToken, {
                    httpOnly: true,
                    maxAge: 10 * 60 * 1000
                })
                .status(StatusCodes.OK)
                .json({});
        });
    } else {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: "Nie ma takiego użytkownika"});
    }
});

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const users = await collection.find({"username": username}).toArray();
    if(users.length){
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: `Podany użytkownik ${username} już istnieje`});
    }
    bcrypt.hash(password, 10,  async (err, hashPass) => {
        const userData = {"username": username, "password": hashPass};
        await collection.insertOne(userData);
    })
    return res
        .status(StatusCodes.OK)
        .json({});
});

router.get('/logout', (req, res) => {
    return res
        .clearCookie("accessToken")
        .redirect("/");
});

router.put('/:username', async (req, res) => {
    const username = req.params.username;
    const {length, mass} = req.body;
    try{
        await collection.updateOne({"username": username}, {
            $set: {
                "length": length,
                "mass": mass
            }
        })
        return res
            .status(StatusCodes.OK)
            .end();
    } catch(err) {
        console.log(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .end();
    }
   
});

router.get('/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const result = await collection.findOne({"username": username});
        return res
            .status(StatusCodes.OK)
            .json({length: result.length, mass: result.mass});

    } catch(err) {
        console.log(err);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .end();
    }
});

module.exports = router;