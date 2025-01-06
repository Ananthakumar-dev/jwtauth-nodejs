require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const jwtMiddleware = require('./middlewares/jwtMiddleware')

app.use(express.json())
app.use(express.static('public'))

app.use('/api/v1/auth', authRoutes)

// Authorized routes
app.use(jwtMiddleware)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/books', bookRoutes)

app.use((err, req, res, next) => {
  return res.status(500).json({
    status: false,
    message: err?.message || 'Something went wrong',
    stack: process.env.APP_ENV === 'local' ? err : null
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})