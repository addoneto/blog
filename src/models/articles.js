const mongoose = require('mongoose');
const slugify = require('slugify');

const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);

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
    imagesUrl: {
        type: [String],
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    }
});

ArticleSchema.pre('save', function(next) {
    this.slug = slugify(this.title, {lower:true, strict: true});
    this.HTMLcontent = dompurify.sanitize(marked(this.markdownContent));
    this.updateDate = Date.now();

    //if(!description) TODO: PICK FIRST PARAGRAPH

    next();
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;