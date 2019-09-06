const express = require('express');
const compression = require('compression');
const app = express();
app.use(compression());
app.use(express.static('dist'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
