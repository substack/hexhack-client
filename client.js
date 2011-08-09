var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Hash = require('hashish');
var DNode = require('dnode');
var Lazy = require('lazy');

var server = DNode.connect(7331, function (mud) {
    var em = new EventEmitter;
    
    var stdin = process.openStdin();
    
    var room = null;
    
    Lazy(stdin).lines.map(String).forEach(function (line) {
        var cmd = (function (m) {
            return m ? m[1] : undefined
        })(line.match(/^\s*(\S+)/));
        
        if (!cmd) {
            console.log('$#@^@#%@$#%$#@SGLO@#$!WAEOSR#$(*ASJ$#*#*@@');
            util.print('> ');
        }
        else if (cmd in room.exits) {
            var args = line.match(/^\s*\S+\s*(.*)/)[1].split(' ');
            room.exits[cmd].apply({}, args);
        }
        else {
            console.log('You can\'t just make up commands. '
                + 'Well actually you can, '
                + 'but you haven\'t made that one up yet.'
            );
            util.print('> ');
        }
    });
    
    em.on('room', function (r) {
        room = r;
        console.log(room.description);
        console.log('Exits: ' + Object.keys(room.exits).join(' '));
        util.print('> ');
    });
    
    mud.play('meow', 'zing', em.emit.bind(em));
});

server.on('localError', function (err) {
    console.error(err.stack ? err.stack : err);
});
