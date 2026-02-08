require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const connectDb = require("./databases/connectDb")
const logger = require("./middleware/reqLogger")
const errorHandler = require("./middleware/errorHandler")
const routes = require("./routes/postRoutes")

const PORT = process.env.PORT || 5012

connectDb()

app.use(express.json())
app.use(cors("*"))
app.use(logger)

app.use('/api', routes)
app.use(errorHandler)
app.listen(PORT, () => {
  console.log("API is running on port " + PORT)
})