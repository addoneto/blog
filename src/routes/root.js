const express = require('express');
const router = express.Router();
const path = require('path');

const Article = require('../models/articles');

const cookie = require('cookie');
const sessionSettings = require('../cookieSettings');
const { generate } = require('generate-password');

router.get('/', async (req, res) => {
    try{
        //const articles = await Article.find({}, {}, { sort: { 'createDate' : {complete : -1 }} }).limit(10).exec();
        const articles = await Article.find({}, {}, { sort: { 'createDate':  -1 } }).limit(10).exec();
        return res.render(path.join(__dirname, '../public/views/home'), {tagFilter: '',articles: articles});
    }catch(err){
        return res.status(500).render(path.join(__dirname, '../public/views/500'));
    }
});



router.get('/login', (req, res) => {
    const cookies = cookie.parse(req.header('cookie') || '');

    if(global.currentSessionID  && cookies.session_id == global.currentSessionID)
        return res.redirect('/dashboard');

    return res.render(path.join(__dirname, '../public/views/login'));
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if(username == process.env.ADM_USER && password == process.env.ADM_PASS){
        const newID = generate({
            length: 15,
            numbers: true,
        });
        
        //  Add 'Set-Cookie' to the response Header with cookie informations
        res.set('Set-Cookie', cookie.serialize('session_id', newID, sessionSettings)); 
        global.currentSessionID = newID;

        console.log('\x1b[34m%s\x1b[0m', `New cookie generated: ${newID}`);
        
        return res.status(202).json({message : 'Authorized!'});
    }

    return res.status(401).json({message : 'Not authorized :('});
});

router.get('/logout', (req, res) => {
    const cookies = cookie.parse(req.header('cookie') || '');

    if(cookies){
        //  clear any current cookie
        res.setHeader('Set-Cookie', "session_id=clear;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT");
        console.log('\x1b[31m%s\x1b[0m', `Cookie clear: ${global.currentSessionID}`);
    } 

    return res.redirect('/login');
});

router.get('/dashboard', (req, res) => {
    const cookies = cookie.parse(req.header('cookie') || '');

    if(global.currentSessionID  && cookies.session_id == global.currentSessionID)
        return res.render(path.join(__dirname, '../private/dashboard'));

    return res.redirect('/login');
});

module.exports = router;