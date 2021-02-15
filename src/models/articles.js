const mongoose = require('mongoose');

const dateFormater = require('../date');

const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

const moment = require('moment-timezone');

const DateSchema = new mongoose.Schema({
    complete: {
        type: Date,
        default: new Date()
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

    // this.createDate.formated = moment().utc().format('dddd, DD/MM/YYYY hh:mm');
    // this.updateDate.formated = moment().utc().format('dddd, DD/MM/YYYY hh:mm');
    this.createDate.formated = moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');
    this.updateDate.formated = moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');

    console.log('\x1b[36m%s\x1b[0m', "Article created! " + this._id)
});

ArticleSchema.pre('updateOne', function() {
    this.set({updateDate: {complete: new Date() }});
    // this.set({updateDate: {formated: moment().utc().format('dddd, DD/MM/YYYY hh:mm') }});
    this.set({updateDate: {formated: moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm') }});
    

    console.log('\x1b[35m%s\x1b[0m', 'Article updated! ' + this._conditions._id);
});

ArticleSchema.pre('deleteOne', function() {
    console.log('\x1b[33m%s\x1b[0m', "Article deleted! " + this._conditions._id);
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;