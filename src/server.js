const express = require('express');
const app = express();
const path = require('path');

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50,
    message: "Too many requests 🤕"
});

app.set('view engine', 'ejs');

if (process.env.NODE_ENV !== 'production') require('dotenv/config');
require('./database');

// MIDDLEWARES
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
app.use(limiter);
app.use('/', require('./routes/root'));
app.use('/edit/', require('./routes/edit'));
app.use('/artigos/', require('./routes/articles'));
app.use('/api/', require('./routes/api'));

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log('\x1b[32m%s\x1b[0m', `Server on at ${port}`)});