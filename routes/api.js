const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/auth", require("./auth"));
router.use("/admin", require("./admin"));
router.use("/seller", require("./seller"));

module.exports = router;
