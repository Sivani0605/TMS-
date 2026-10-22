const router = require("express").Router();
const controller = require(
  "../controllers/blockController"
);

router.get("/", controller.getBlocks);
router.post("/", controller.createBlock);
router.put("/:id", controller.updateBlock);
router.delete("/:id", controller.deleteBlock);

module.exports = router;