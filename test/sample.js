/**
 * Created by gaurav on 6/7/15.
 */
var Hapi = require('hapi');
var Good = require('good');
var GoodCallback = require('../index');

var server = new Hapi.Server()
server.connection({host:'192.168.0.143', port:1000});
var systemReportPlugin = {
    register: Good,
    options: {
        opsInterval: 10000, //300000 = 5 min
        reporters: [{
            reporter: GoodCallback,
            events: { ops: "*", request:"*" },
            config:{
                bindTo: {a:'Hello'},
                mCallback: function(){
                    console.log('Callback fired', this.a);
                },
                cache_size: 10
            }
        }]
    }
};
server.route({
    method: 'GET',
    path: '/temp',
    handler: function (request, reply) {
        reply('Thanks');
    }
});
server.register(systemReportPlugin, function(error){
    if(error){
        console.log('Error while loading plugin.');
        return process.exit(1);
    }
    // on plugin loaded.
    server.start(function(info){
        console.log(info);
        console.log(server.table());
    });
});