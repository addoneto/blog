const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const path = require('path');
const { generate } = require('generate-password');

router.get('/', async (req, res) => {
    try{
        const articles = await Article.find({}, {}, { sort: { 'createDate' : -1 } }).limit(10).exec();
        return res.render(path.join(__dirname, '../public/views/home'), {tagFilter: '',articles: articles});
    }catch(err){
        return res.status(500).render(path.join(__dirname, '../public/views/500'));
    }
});

router.get('/dashboard', (req, res) => {
    const { cookies } = req;
    if(cookies.session_id == global.currentSessionID)
        return res.render(path.join(__dirname, '../private/dashboard'));

    return res.redirect('/login');
});

// function validadeCookie(req, res, next){
//     const { cookies } = req;
//     if(cookies.session_id == global.currentSessionID) next();

//     return res.redirect('');
// }

router.get('/login', (req, res) => {
    const { cookies } = req;
    if(global.currentSessionID  && cookies.session_id == global.currentSessionID)
        return res.redirect('/dashboard');
        //return res.render(path.join(__dirname, '../public/views/adm'));

    return res.render(path.join(__dirname, '../public/views/login'));
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    if(username == process.env.ADM_USER && password == process.env.ADM_PASS){
        const newID = generate({
            length: 15,
            numbers: true,
        });

        res.cookie('session_id', newID);
        global.currentSessionID = newID;
        console.log('\x1b[34m%s\x1b[0m', `New cookie generated: ${newID}`);
        return res.status(202).json({message : 'Authorized!'});
        // return res.redirect('/dashboard');
    }

    return res.status(401).json({message : 'Not authorized :('});
});

router.get('/logout', (req, res) => {
    const { cookies } = req;
    if(cookies){
        res.clearCookie('session_id');
        console.log('\x1b[31m%s\x1b[0m', `Cookie clear: ${global.currentSessionID}`);
    } 

    return res.redirect('/login');
});

module.exports = router;