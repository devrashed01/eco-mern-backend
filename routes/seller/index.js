const auth = require("../../middleware/auth");
const seller = require("../../middleware/seller");

const router = require("express").Router();

router.use(auth, seller);

router.use("/sales", require("./sales"));
router.use("/statistics", require("./statistics"));

module.exports = router;
