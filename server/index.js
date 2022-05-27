if(typeof window === 'undefined') {
    global.window = {};
}

const fs = require('fs');
const path = require("path");
const express = require("express");
const { renderToString } = require("react-dom/server");
const SSR = require('../dist/chanks/search-server');
const template = fs.readFileSync(path.resolve(__dirname, '../dist/search.html'), 'utf-8')

const server = (port) => {
    const app = express();
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('/search',(req,res)=>{
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    app.listen(port, ()=>{
        console.log('serveris open' + port);
    })
}
server(process.env.PORT || 3000);

const renderMarkup = (str) => {
    return template.replace('<!--HTML_PLACEHOLDER-->', str);
}