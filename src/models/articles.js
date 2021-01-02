const mongoose = require('mongoose');

const dateFormater = require('../date');

const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

const DateSchema = new mongoose.Schema({
    complete: {
        type: Date,
        default: Date.now
    },
    formated: String,
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
        required: false,
    },
    banner: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    markdown: {
        type: String,
        require: true,
    },
    HTMLcontent: {
        type: String,
        require: false,
    },
    createDate: {
        type: DateSchema,
        default: () => ({}) // Subdocument default
    },
    updateDate: {
        type: DateSchema,
        default: () => ({})
    },
});

ArticleSchema.pre('save', function(){
    this.slug = slugify(this.title, {lower:true, strict: true});
    
    this.HTMLcontent = dompurify.sanitize(marked(this.markdown));
    if(!this.description) this.description = this.markdown.split('\n')[0];

    this.createDate.formated = dateFormater.ptFormat(this.createDate.complete);
    this.updateDate.formated = dateFormater.ptFormat(this.updateDate.complete);

    console.log('\x1b[36m%s\x1b[0m', "Article created! " + this._id)
});

ArticleSchema.pre('updateOne', function() {
    const now = new Date();
    this.set({updateDate: {complete: now }});
    this.set({updateDate: {formated: dateFormater.ptFormat(now) }});

    console.log('\x1b[35m%s\x1b[0m', 'Article updated! ' + this._conditions._id);
});

ArticleSchema.pre('deleteOne', function() {
    console.log('\x1b[33m%s\x1b[0m', "Article deleted! " + this._conditions._id);
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;