const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParse = require('cookie-parser')
const credentials = require('./middleware/credentials')
const swaggerDocument = YAML.load('./api-docs/swagger.yaml');
const PORT = process.env.PORT || 3000

//custom middleware logger
app.use(logger);

//Handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials)

//Cross-Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

//middleware foe cookies
app.use(cookieParse())

app.use('/', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
//Swagger Page
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))


app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" })
  } else {
    res.type('txt').send("404 Not Found")
  }

})

app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})