/*	

	jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)
	Priority added by Bob Bonifield (bobbonifield@gmail.com)

	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

	Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.

*/	

;(function(d){

	// the topic/subscription hash
	var cache = {};

	d.publish = function(/* String */topic, /* Integer? */priority, /* Array? */args){
		// summary: 
		//		Publish some data on a named topic with the option of only pushlishing
		//		to callbacks with a specific priority
		// topic: String
		//		The channel to publish on
		// priority: Integer?
		//		The priority to publish at.  If not provided, every handler for a
		//		given topic is executed.
		// args: Array?
		//		The data to publish. Each array item is converted into an ordered
		//		arguments on the subscribed functions. 
		//
		// example:
		//		Publish stuff on '/some/topic'. Anything subscribed will be called
		//		with a function signature like: function(a,b,c){ ... }
		//
		//	|		$.publish("/some/topic", ["a","b","c"]);
		//	|		$.publish("/some/topic", 20, ["a","b","c"]);

		if (cache[topic]){
			var priority_supplied = !isNaN(priority),
			    callbacks = [];
			if (priority_supplied){
				cache[topic][priority] && d.each(cache[topic][priority], function(){
					this.apply(d, args || []);
				});
			} else {
				args = priority;
				d.each(cache[topic], function(){
					d.each(this, function(){
						this.apply(d, args || []);
					});
				});
			}
		}
	};

	d.subscribe = function(/* String */topic, /* Integer? */priority, /* Function */callback){
		// summary:
		//		Register a callback on a named topic with an optional subscription priority
		// topic: String
		//		The channel to subscribe to
		// priority: Integer?
		//		The priority that the callback should use.  If not provided, the callback
		//		will use the default priority.
		// callback: Function
		//		The handler event. Anytime something is $.publish'ed on a 
		//		subscribed channel, the callback will be called with the
		//		published array as ordered arguments.
		//
		// returns: Array
		//		A handle which can be used to unsubscribe this particular subscription.
		//	
		// example:
		//	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//	|	$.subscribe("/some/topic", 20, function(a, b, c){ /* handle data */ });

		default_priority = d.subscribe.default_priority;
		callback = callback || priority;
		priority = callback ? priority || default_priority : default_priority;
		if(!cache[topic]){
			cache[topic] = [];
		}
		if(!cache[topic][priority]){
			cache[topic][priority] = [];
		}
		cache[topic][priority].push(callback);
		return [topic, callback, priority]; // Array
	};

	// the priority that a subscription should use if one is not provided
	d.subscribe.default_priority = 10;

	d.unsubscribe = function(/* Array */handle){
		// summary:
		//		Disconnect a subscribed function for a topic.
		// handle: Array
		//		The return value from a $.subscribe call.
		// example:
		//	|	var handle = $.subscribe("/something", function(){});
		//	|	$.unsubscribe(handle);
		//	|	var handle = $.subscribe("/something", 20, function(){});
		//	|	$.unsubscribe(handle);
		
		var t = handle[0],
		    p = handle[2];
		cache[t] && cache[t][p] && d.each(cache[t][p], function(idx){
			if(this == handle[1]){
				cache[t][p].splice(idx, 1);
			}
		});
	};

})(jQuery);

