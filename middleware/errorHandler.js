const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  console.error(error.stack || "")
  const status = error.status || 500
  res.status(status).json({Error: error.message})
}

module.exports = errorHandler