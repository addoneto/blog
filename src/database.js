const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('\x1b[32m%s\x1b[0m', 'Connected to DB')
);

module.exports = mongoose;