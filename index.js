
const express = require('express');
const app = express();
const morgan = require('morgan');

const dataSetsRouter = require('./routes/dataSets');
const routesRouter = require('./routes/routes');
const { dbConnect } = require('./mongoose.js');

const { PORT } = require('./config');


app.use(express.static('public'));

app.use(express.json());


app.use(
  morgan('common')
);


app.use('/api/dataSets', dataSetsRouter);
app.use('/api/routes', routesRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}


if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };