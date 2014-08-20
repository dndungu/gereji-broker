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
		emit : function(event) {
			event = typeof event == "string" ? {type : event, data : {}} : event;
			event.data = typeof event.data == "undefined" ? {} : event.data;
			try{
				self.store.context.log(5, event);
				var listeners = self.events[event.type];
				if(!listeners)
					throw new Error('There  are no event listeners for ' + event.type);
				for(var i in listeners){
					if(typeof listeners[i] === 'function')
						listeners[i](event);
				}
			}catch(error){
				self.store.context.log(2, error.stack);
			}
		}
	}
};
