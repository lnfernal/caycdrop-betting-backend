var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var ejs = require('ejs')
require("dotenv").config()

require("./model/database").sequelize.sync()

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var authRouter = require("./routes/auth")

var port = process.env.PORT || 5000

var app = express()

// view engine setup
app.engine('html', ejs.renderFile)
app.set("view engine", "html")
app.set("views", path.join(__dirname, "views"))

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/api/auth", authRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

app.listen(port, () => {
  console.log("Sever is running on port: ", port)
})
