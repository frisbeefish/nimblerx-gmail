var express = require('express');
var app = express();
var routes = require('./routes/index');

var https = require('https');

var fs = require('fs');

var options = {
   key  : fs.readFileSync('server.key'),
   cert : fs.readFileSync('server.crt')
};


app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


if (app.get('env') === 'production') {
    app.listen(app.get('port'), function() {
       console.log('scott Node app is running on port', app.get('port'));
   });
} else {
   var server = https.createServer(options, app);
      
    server.listen(app.get('port'), function() {
      console.log('scott Node app is running on port', app.get('port'));
    });

}

