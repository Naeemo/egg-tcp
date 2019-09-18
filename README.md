# egg-tcp

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/egg-tcp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-tcp

<!--
Description here.
-->

## Install

```bash
$ npm i egg-tcp --save
```
or
```bash
$ yarn add egg-tcp
```

## Usage

```js
// {app_root}/config/plugin.js
exports.tcp = {
    enable: true,
    package: 'egg-tcp',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.tcp = {
    port: 5001,
    host: '127.0.0.1'
};
```

## Example

```js
// {app_root}/app/tcp/controller/index.js
module.exports = app => {
    return {
        async feed(socket) {
            console.log('A new connection has been established.');
            
            // Now that a TCP connection has been established, the server can send data to
            // the client by writing to its socket.
            socket.write('Hello, client.');
            
            // The server can also receive data from the client by reading from its socket.
            socket.on('data', function (chunk) {
                console.log(`Data received from client: ${chunk.toString()}.`);
                
            });
            
            // When the client requests to end the TCP connection with the server, the server
            // ends the connection.
            socket.on('end', function () {
                console.log('Closing connection with the client');
            });
            
            // Don't forget to catch error, for your own sake.
            socket.on('error', function (err) {
                console.log(`Error: ${err}`);
            });
        }
    };
};

```

```js
// {app_root}/app/router.ts
app.tcp.handle('index.feed')
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).


## Thanks 

> [egg-udp](https://github.com/ruur/egg-udp)

## License

[MIT](LICENSE)
