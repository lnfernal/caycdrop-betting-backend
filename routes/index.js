var express = require("express")
var router = express.Router()
const auth = require("../middleware/auth")

/* GET home page. */
router.get("/", auth, function (req, res) {
  res.render("index", { title: "Express" })
})

module.exports = router
