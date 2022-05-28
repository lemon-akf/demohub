const Router = require("koa-router");

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo,
} = require("../controller/moment.controller");
const { verifyLabelExists } = require("../middleware/label.middleware");
const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");

const momentRouter = new Router({ prefix: "/moment" });

momentRouter.post("/", verifyAuth, create);

momentRouter.get("/", list);
momentRouter.get("/:momentId", detail);

momentRouter.patch("/:momentId", verifyAuth, verifyPermission, update);

momentRouter.delete("/:momentId", verifyAuth, verifyPermission, remove);
// 给动态添加标签
momentRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPermission,
  verifyLabelExists,
  addLabels
);
momentRouter.get("/images/:filename", fileInfo);
module.exports = momentRouter;
