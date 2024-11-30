import { Router } from "express";
import {
  addFriend,
  createUser,
  removeFriend,
  deleteUser,
  getUserById,
  getAllUsers,
  updateUser,
} from "../../Controllers/userControllers.js";
const router = Router();

router.route("/").get(getAllUsers).post(createUser);

router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

export { router as userRouter };