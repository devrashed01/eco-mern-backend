const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");

const router = require("express").Router();

router.use(auth, admin);

router.use("/user", require("./user"));
router.use("/sales", require("./sales"));
router.use("/statistics", require("./statistics"));

module.exports = router;
