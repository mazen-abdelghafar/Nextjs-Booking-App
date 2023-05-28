import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import onError from "../../../../middlewares/error";
import {
  getRoomReviews,
  deleteRoomReview,
} from "../../../../controllers/roomController";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "../../../../middlewares/auth";

const handler = nc({ onError });
dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles("admin")).get(getRoomReviews);
handler.use(isAuthenticatedUser, authorizeRoles("admin")).put(deleteRoomReview);

export default handler;
