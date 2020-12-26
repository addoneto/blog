const express = require('express');
const router = express.Router();
const path = require('path');
const Article = require('../models/articles');

router.get('/', (req, res) => {
    return res.status(404).render(path.join(__dirname, '../public/views/404'));
});

router.get('/:tag', async (req, res) => {
    const tag = req.params.tag;
    const articles = await Article.find({ tags: tag }).exec();
    //const articles = await Article.find({ tags: { "$in" : [tag]}}).exec();

    return res.render(path.join(__dirname, '../public/views/home'), {tagFilter: `Filtro: ${tag}`,articles: articles});
});

module.exports = router;