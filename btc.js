const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');

const WS_URL = 'wss://api.huobi.pro/ws';


var orderbook = {};
var emmiter = {};
exports.OrderBook = orderbook;
exports.emmiter = emmiter;
function handle(data) {
    // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];
    switch (channel) {
        case 'depth':
            orderbook[symbol] = data.tick;
            break;
        case 'kline':
            console.log('kline', data.tick);
            emmiter.sendSocketNotification("danmu-NOTIFICATION_TEST", {"text":Math.round(data.tick.close*0.51077801*6.5) + "元"})
            break;
    }
}

function subscribe(ws) {
    var symbols = ['btcusdt'];
    // 订阅K线
    for (let symbol of symbols) {
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.kline.1min`,
            "id": `${symbol}`
        }));
    }
}

function init(emmit) {
    emmiter = emmit
    var ws = new WebSocket(WS_URL);
    ws.on('open', () => {
        console.log('open');
        subscribe(ws);
    });
    ws.on('message', (data) => {
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
           // console.log(msg);
            handle(msg);
        } else {
            console.log(text);
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
