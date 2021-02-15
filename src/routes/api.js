const express = require('express');
const router = express.Router();
const Article = require('../models/articles');

const cookie = require('cookie');

const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

router.use((req, res, next) => {
    const cookies = cookie.parse(req.header('cookie') || '');

    if(global.currentSessionID && cookies.session_id == global.currentSessionID)
        return next();   

    return res.status(401).json({message:'Unable to authenticate'});
});

router.post('/article', async (req, res) => {
    const data = {
        title: req.body.title,
        banner: req.body.banner,
        tags: req.body.tags,
        description: req.body.description,
        markdown: req.body.markdown
    };

    try{
        const newArticle = await Article.create(data);
        return res.status(201).json({message:'Article created!', data: newArticle});
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
        banner: req.body.banner,
        tags: req.body.tags,
        description: req.body.description,
        markdown: req.body.markdown,
    };

    // remove information not provided so they're not updated as null
    // for (let prop in changeAtributes) {
    //     if(changeAtributes[prop] === null) delete changeAtributes[prop];
    // }

    changeAtributes.slug = slugify(changeAtributes.title, {lower:true, strict: true});
    changeAtributes.HTMLcontent = dompurify.sanitize(marked(changeAtributes.markdown));

    try{
        const response = await Article.updateOne({ _id: id }, { $set: changeAtributes});

        if(response.n == 0)
            return res.status(404).json({message: `No documents found with id: ${id}`});
        else if(response.n != 0 && response.nModified != 0)
            return res.status(200).json({message: `Article(s) Edited (n${response.nModified})`});

        // return res.end();
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

router.post('/markdownPreview', async (req, res) => {
    const markdown = req.body.markdown;
    if(!markdown) return res.json({data:'Missing information!'});

    try{
        const htmlResult = dompurify.sanitize(marked(markdown));
        return res.status(200).json({data: htmlResult});
    }catch(err){
        return res.status(500).json({data: 'Could not render html :('});
    }
    
});

module.exports = router;