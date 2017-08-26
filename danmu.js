Module.register("danmu",{
	defaults: {
		text: "Hello World!"
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div")
		wrapper.innerHTML = this.config.text
		return wrapper;
    },
    notificationReceived: function(notification, payload, sender) {
        console.log("danmu.js:13")
        if (sender) {
            Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
        } else {
            Log.log(this.name + " received a system notification: " + notification);
        }
    },
    socketNotificationReceived: function(notification, payload) {
        console.log("danmu.js:21")
        Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        this.config.text=payload.text
        this.updateDom()

    },
    start: function(){
        console.log("danmu start")
        this.sendSocketNotification("danmu-NOTIFICATION_TEST",{text:"init"});
    }
});