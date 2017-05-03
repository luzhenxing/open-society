const express = require('express'),

  app = express(),
  PORT = 3000

app.use('/dist', express.static('dist'))
app.use('/bootstrap', express.static('dist/bootstrap'))
app.use('/scripts', express.static('dist/scripts'))
app.use('/styles', express.static('dist/styles'))
app.use('/images', express.static('dist/images'))
app.use('/ueditor', express.static('ueditor'))
app.use('/', express.static('views'))

app.listen(PORT, () => console.log('Server runing at port: ' + PORT + '.'))
