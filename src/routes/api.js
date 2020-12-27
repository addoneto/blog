const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

router.use((req, res, next) => {
    const { cookies } = req;
    if(cookies.session_id == global.currentSessionID)
        return res.status(401).json({message:'Unable to authenticate'});

    next();
});

router.post('/article', async (req, res) => {
    const data = {title: req.body.title,
            tags: req.body.tags,
            description: req.body.description,
            markdown: req.body.markdown};

    try{
        const newArticle = await Article.create(data);
        return res.status(201).json({message:'Article created', data: newArticle});
    }catch(err){
        return res.status(500).json({message: 'Failed to create article'});
    }
});

router.delete('/article', async (req, res) => {
    const { id } = req.body;
    
    if(!id) return res.status(400).json({message: "Bad Request! Missing id"});

    Article.deleteOne({ _id: id }, err => {
        if (err) return res.status(404).json({message:'Failed deleting article'});
        
        return res.status(200).json({message:'Article deleted'});
    });
});

router.put('/article', async (req, res) => {
    const { id } = req.body;

    if(!id) return res.status(400).json({message: "Bad Request! Missing id"});

    let changeAtributes = {
        title: req.body.title,
        tags: req.body.tags,
        description: req.body.description,
        markdown: req.body.markdown,
        imagesUri: req.body.imagesUri || null};

    // remove information not provided so they're not updated as null
    for (let prop in changeAtributes) {
        if(!changeAtributes[prop])
            delete changeAtributes[prop];
    }

    try{
        const response = await Article.updateOne({ _id: id }, changeAtributes);

        if(response.n == 0)
            return res.status(404).json({message: `No documents found with id: ${id}`});
        else if(response.n != 0 && response.nModified != 0)
            return res.status(200).json({message: `Article Edited (${response.nModified})`});

        return res.end();
    }catch(err){
        return res.status(500).json({message: 'Error ocurred'});
    }
});

router.get('/article/:id', async (req, res) => {
    const { id } = req.params;

    if(!id) return res.status(400).json({message: "Missing id"});

    try{
        const article = await Article.findById(id).exec();
        return res.status(200).json({data: article});
    }catch(err){
        return res.status(404).json({message: 'Article Not Found'});
    }
});

router.get('/article-all', async (req, res) => {
    try{
        const articles = await Article.find({});
        return res.status(200).json({data: articles});
    }catch(err){
        return res.status(500).json({message: 'Could not query all Articles'});
    }
});

module.exports = router;