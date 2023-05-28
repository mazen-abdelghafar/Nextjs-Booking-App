import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import onError from "../../../../middlewares/error";
import { resetPassword } from "../../../../controllers/authController";

const handler = nc({ onError });
dbConnect();

handler.put(resetPassword);

export default handler;
