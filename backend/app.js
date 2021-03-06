let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let schedule = require('node-schedule');

let coinsService = require('./services/coinsChart.service');

let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
server.listen(3001);

let apiSocket = coinsService.getSocket();
let currencyNames = [];
let currencyHistoricalData = [];
let coinLive = '';

let retrieveCurrencies = () => {
    currencyNames = [];
    coinsService.getCurrencies().then(
        function (result) {
            let arr = [];
            let i = 0;
            result['Data'].map((e) => {
                currencyNames.push(
                    {
                        name: e['SYMBOL'],
                        selected: false,
                        id: i++
                    }
                );
                arr.push(coinsService.getCoinData(e['SYMBOL']), e['SYMBOL']);
            });
            return Promise.all(arr);
        }
    ).then(
        (e) => currencyHistoricalData = e
    )
};
retrieveCurrencies();
schedule.scheduleJob('0 0 * * *', retrieveCurrencies);

io.on('connection', (socket) => {

    socket.on('getInitializationData', () => {
        console.log("przesylam poczatkowe dane");
        socket.emit('coinsList', {
            msg: currencyNames,
            coinsData: currencyHistoricalData
        })
    });


    socket.on('changeCoinArray', (message) => {
        console.log("added rray" + message.msg);
        currencyNames = message.msg;
        socket.broadcast.emit('changeCoinArray', {
            msg: message.msg
        });
    });

    socket.on('getCoinLive', (message) => {
        console.log(coinLive);
        if(!(coinLive === '')){
            console.log('remove sub'+ coinLive)
            apiSocket.emit('SubRemove',{subs: ['2~Poloniex~' + coinLive + '~USD']})
        }
        coinLive = message.msg;
        apiSocket.emit('SubAdd', {subs: ['2~Poloniex~' + message.msg + '~USD']})

    });

});

apiSocket.on('m', (e) => {
    io.sockets.emit('coinLiveData', {
        msg: e,
        name: coinLive
    })
});
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', 'http://charts.pawfa.usermd.net');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
