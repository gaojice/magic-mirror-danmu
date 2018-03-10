/* Magic Mirror
 * Node Helper: {{MODULE_NAME}}
 *
 * By {{AUTHOR_NAME}}
 * {{LICENSE}} Licensed.
 */

var NodeHelper = require("node_helper");
const moment = require('moment');
const WebSocket = require('ws');
const WS_URL = 'wss://real.okex.com:10441/websocket';

module.exports = NodeHelper.create({
        start: function(){
            var self = this
	    self.initws(self)
        },

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === "danmu-NOTIFICATION_TEST") {
			console.log("Working notification system. Notification:", notification, "payload: ", payload);
			// Send notification
             
			self.sendSocketNotification("danmu-NOTIFICATION_TEST", payload);
			return;
		}
	},
        
        subscribe: function(ws) {
	    var symbols = ['btcusdt'];
	    // 订阅K线
	    for (let symbol of symbols) {
        	ws.send("{'event':'addChannel','channel':'ok_sub_spot_ugc_usdt_ticker'}");
    	  }
	},

        initws: function() {
           var self = this
 	   var ws = new WebSocket(WS_URL);
	    ws.on('open', () => {
        	console.log('open');
	        self.subscribe(ws);
	    });
	    ws.on('message', (data) => {
	      try{
	       console.log(data)
	       let msg = JSON.parse(data);
	       if (msg.ping) {
	           ws.send(JSON.stringify({
	               pong: msg.ping
	           }));
	       } else if (msg[0].data) {
	          self.sendSocketNotification("danmu-NOTIFICATION_TEST", {"text":Number(msg[0].data.last).toFixed(4) + "USDT"})
	       } else {
	           console.log(text);
	       }
	     } catch (e) {
		console.log(e)
	     }
	   });
	   ws.on('close', () => {
	       console.log('close');
	       self.initws();
	   });
	   ws.on('error', err => {
	       console.log('error', err);
	       self.initws();
	   });
}

 

	 
});
