const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");

const router = require("express").Router();

router.use(auth, admin);

router.use("/user", require("./user"));

module.exports = router;
