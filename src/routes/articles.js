const express = require('express');
const router = express.Router();
const path = require('path');

const Article = require('../models/articles');

const dateConverter = require('../date');

router.get('/', (req, res) => {
    res.redirect('../'); 
    //return res.status(404).render(path.join(__dirname, '../public/views/404'), {});
})

router.get('/:title', async (req, res) => {
    try{
        let article = await Article.findOne({slug: req.params.title}).exec();
        if(article == null)
            return res.status(404).render(path.join(__dirname, '../public/views/404'), {});
        
        article.createDate = dateConverter.ptFormat(article.createDate);
        article.pdateDate = dateConverter.ptFormat(article.updateDate);

        res.render(path.join(__dirname, '../public/views/article'), {data: article});
    }catch(err){
        return res.status(500).send('Unable to acess article: ' + req.params.title);
    }
});

module.exports = router;