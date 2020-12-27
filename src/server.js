const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

require('dotenv/config');
require('./database');

// MIDDLEWARES
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
//app.use('*', statusUpdate);
app.use('/', require('./routes/root'));
app.use('/api', require('./routes/api'));
app.use('/artigos', require('./routes/articles'));
app.use('/tags', require('./routes/tags'));

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log('\x1b[32m%s\x1b[0m', `Server on at ${port}`)});