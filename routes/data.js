const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/suggestions", dataController.getSuggestions);
router.post("/recs", dataController.getMusicRecs);

module.exports = router;