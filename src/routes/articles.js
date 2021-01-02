const express = require('express');
const router = express.Router();
const path = require('path');

const Article = require('../models/articles');

router.get('/', (req, res) => {
    res.redirect('../'); 
})

router.get('/:title', async (req, res) => {
    try{
        let article = await Article.findOne({slug: req.params.title}).exec();
        if(article == null)
            return res.status(404).render(path.join(__dirname, '../public/views/http-error'), {code: '404', message:"Não foi possível encontrar esse artigo? 😕"});

        res.render(path.join(__dirname, '../public/views/article'), {data: article});
    }catch(err){
        return res.status(500).render(path.join(__dirname, '../public/views/http-error'), {code: '500', message:"Algo de errado ocorreu no Servidor 😦"});
    }
});

module.exports = router;