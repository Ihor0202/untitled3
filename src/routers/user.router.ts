import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middleweres/common.middleware";
import { UserValidator } from "../valodators/user.validator";

const router = Router();

router.get("/", userController.getList);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);
router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.getByIdPut,
);
router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.deleteById,
);

export const userRouter = router;
