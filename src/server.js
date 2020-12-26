const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.set('view engine', 'ejs')

require('dotenv/config');
require('./database');

// MIDDLEWARES
app.use(cookieParser(null, {maxAge: 21600,  sameSite: true, httpOnly: true})); // secure: true
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
//app.use('*', statusUpdate);
app.use('/', require('./routes/home'));
app.use('/api', require('./routes/api'));
app.use('/artigos', require('./routes/articles'));
app.use('/tags', require('./routes/tags'));

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log('\x1b[32m%s\x1b[0m', `Server on at ${port}`)});