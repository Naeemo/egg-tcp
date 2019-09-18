'use strict';

const net = require('net');
const path = require('path');
const PLUGIN_NAME = 'tcp';

function resolveController(controller, app) {
    if (typeof controller === 'string') {
        const actions = controller.split('.');
        let obj = app[PLUGIN_NAME].controller;
        actions.forEach(key => {
            obj = obj[key];
            if (!obj) throw new Error(`controller '${controller}' not exists`);
        });
        controller = obj;
    }
    // ensure controller is exists
    if (!controller) throw new Error('controller not exists');
    return controller;
}

function EggTCP(app) {
    this.app = app;
    const server = net.createServer();
    server.listen(app.config.tcp.port, app.config.tcp.host);
    this.server = server
}

EggTCP.prototype.handle = function (handler) {
    const controller = resolveController(handler, this.app);
    
    this.server.on('error', (err) => {
        this.app.coreLogger.error(`egg-tcp error:\n${err.stack}`);
    });
    
    // When a client requests a connection with the server, the server creates a new
    // socket dedicated to that client. The socket was handled by controller.
    this.server.on('connection', controller);
    
    this.server.on('listening', () => {
        const address = this.server.address();
        this.app.coreLogger.info(`egg-tcp listening ${address.address}:${address.port}`);
    });
};

module.exports = app => {
    app[PLUGIN_NAME] = new EggTCP(app);
    app[PLUGIN_NAME].controller = app[PLUGIN_NAME].controller || {};
    
    app.beforeClose(function () {
        app[PLUGIN_NAME].server.close()
    });
    
    new app.loader.FileLoader({
        directory: path.join(app.config.baseDir, 'app', PLUGIN_NAME, 'controller'),
        target: app[PLUGIN_NAME].controller,
        inject: app,
    }).load();
};
