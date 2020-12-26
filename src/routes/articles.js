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
        const article = await Article.findOne({urlTitle: req.params.title}).exec();
        if(article == null)
            return res.status(404).render(path.join(__dirname, '../public/views/404'), {});
        
        const data = {
            title: article.title,
            markdownContent: article.markdownContent,
            imagesUrl: article.imagesUrl,
            tags: article.tags,
            createDate: dateConverter.ptFormat(article.createDate),
            updateDate: dateConverter.ptFormat(article.updateDate),
        }

        res.render(path.join(__dirname, '../public/views/article'), {data: data});
    }catch(err){
        return res.status(500).send('Unable to acess article: ' + req.params.title);
    }
});

module.exports = router;