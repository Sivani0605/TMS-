const router = require("express").Router();
const controller =
  require("../controllers/programmeController");

router.get("/", controller.getProgrammes);
router.post("/", controller.createProgramme);
router.put("/:id", controller.updateProgramme);
router.delete("/:id", controller.deleteProgramme);

module.exports = router;