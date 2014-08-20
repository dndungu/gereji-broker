"use strict";
var fs = require("fs");
module.exports = function(){
	var self = {
		events: [],
		store: {}
	};
	return {
		init: function(){
			self.events = [];
		},
        set : function(name, value) {
            self.store[name] = value;
            return this;
        },
		on : function() {
			var types = typeof arguments[0] == "string" ? [ arguments[0] ] : arguments[0];
			for ( var i in types) {
				var type = types[i];
				self.events[type] = typeof self.events[type] == 'undefined' ? [] : self.events[type];
				self.events[type].push(arguments[1]);
			}
		},
		emit : function(_event) {
			_event = typeof _event == "string" ? {type : _event, data : {}} : _event;
			_event.data = typeof _event.data == "undefined" ? {} : _event.data;
			try{
				this.log(5, _event);
				var listeners = self.events[_event.type];
				if(!listeners)
					throw new Error('There  are no event listeners for ' + _event.type);
				for(var i in listeners){
					typeof listeners[i] === 'function' && listeners[i](_event);
				}
			}catch(error){
				this.log(2, error.stack);
			}
		},
        log: function(severity, message){
			var settings = self.store.context.get("settings");
            var logfile = settings.debug.file;
            var uri = self.store.context.get("uri");
            var method = self.store.context.get("method");
            if(severity > settings.debug.level)
				return;
            var line = (new Date()) + ' (' + severity + ') : [' + uri + '] ' + ' {' + method + '} ' + (JSON.stringify(message));
            fs.appendFile(logfile, line, function(){});
            return this;
        }
	}
};
