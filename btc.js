const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');

const WS_URL = 'wss://real.okex.com:10441/websocket';


var orderbook = {};
exports.OrderBook = orderbook;

function subscribe(ws) {
    var symbols = ['btcusdt'];
    // 订阅K线
    for (let symbol of symbols) {
        ws.send("{'event':'addChannel','channel':'ok_sub_spot_ugc_usdt_ticker'}");
    }
}

function init(emmit) {
    var ws = new WebSocket(WS_URL);
    ws.on('open', () => {
        console.log('open');
        subscribe(ws);
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
           emmit.sendSocketNotification("danmu-NOTIFICATION_TEST", {"text": msg[0].data.last + " USDT"})
        } else {
            console.log(text);
        }
      } catch (e) {
	console.log(e)
      }
    });
    ws.on('close', () => {
        console.log('close');
        init();
    });
    ws.on('error', err => {
        console.log('error', err);
        init();
    });
}

exports.init = init
