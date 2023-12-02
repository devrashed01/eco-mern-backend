const auth = require("../../middleware/auth");
const seller = require("../../middleware/seller");

const router = require("express").Router();

router.use(auth, seller);

router.use("/sales", require("./sales"));

module.exports = router;
