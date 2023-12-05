const { statistics } = require("../../controllers/admin/statisticsController");

const router = require("express").Router();

router.get("/", statistics);

module.exports = router;
