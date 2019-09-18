'use strict';

const mock = require('egg-mock');
const net = require('net');

describe('test/tcp.test.js', () => {
    let app;
    before(() => {
        app = mock.app({
            baseDir: 'apps/tcp-test',
        });
        return app.ready();
    });
    
    after(() => app.close());
    
    it('should get echo response from server', () => new Promise(function (resolve, reject) {
            const client = new net.Socket();
            client.connect(5001, '127.0.0.1', function () {
                console.log('Connected');
                console.log(client.write('Hello, server! Love, Client.'));
            });
            
            client.on('data', function (data) {
                console.log('Received: ' + data);
                client.destroy(); // kill client after server's response
                resolve()
            });
            client.on('error', function (data) {
                client.destroy(); // kill client after server's response
                reject()
            });
            
            client.on('close', function () {
                console.log('Connection closed');
            });
        })
    );
});
