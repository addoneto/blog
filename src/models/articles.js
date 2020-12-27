const mongoose = require('mongoose');
const slugify = require('slugify');

const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

const dateConverter = require('../date');

const completeDate = new mongoose.Schema({
    complete: {
        type: Date,
        default: Date.now,
    },
    formated: {
        type: String,
    }
});

completeDate.pre('save', next => {
    this.formated = dateConverter.ptFormat(this.complete);
    next();
});

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true,
    },
    tags: {
        type: [String],
    },
    banner: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    markdown: {
        type: String,
        require: true,
    },
    HTMLcontent: {
        type: String,
    },
    createDate: {
        type: completeDate,
        required: true,
    },
    updateDate: {
        type: completeDate,
        required: true,
    }
});

ArticleSchema.pre('save', next => {
    this.slug = slugify(this.title, {lower:true, strict: true});
    this.HTMLcontent = dompurify.sanitize(marked(this.markdownContent));
    this.updateDate = {complete: Date.now()};

    if(!this.description) this.description = markdown.split('')[0];

    next();
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;