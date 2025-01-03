require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: false,
    message: err?.message || 'Something went wrong'
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})