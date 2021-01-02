const express = require('express');
const router = express.Router();
const path = require('path');
const Article = require('../models/articles');

const cookie = require('cookie');

router.use((req, res, next) => {
    const cookies = cookie.parse(req.header('cookie') || '');

    if(!global.currentSessionID || cookies.session_id != global.currentSessionID)
        return res.redirect('/login/');
    
    next();  
});

router.get('/new/', (req, res) => {
    return res.render(path.join(__dirname, '../private/post.ejs'), {});
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if(!id) return res.status(400).json({message: "Missing id"});

    try{
        const article = await Article.findById(id).exec();
        if(article) return res.render(path.join(__dirname, '../private/edit.ejs'), {article});

        return res.status(404).render(path.join(__dirname, '../public/views/http-error'), {code: '404', message:"Article not found"});
    }catch(err){
        return res.status(500).render(path.join(__dirname, '../public/views/http-error'), {code: '500', message:"Algo de errado ocorreu no Servidor 😦"});
    }
});

module.exports = router;