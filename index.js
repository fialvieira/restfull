const http = require('http');

let server = http.createServer((req, res) => {

    console.log('URL: ', req.url);
    console.log('Method: ', req.method);

    res.end('Ok');

});

server.listen(3000, '127.0.0.1', ()=>{
    console.log('Servidor rodando!');
});