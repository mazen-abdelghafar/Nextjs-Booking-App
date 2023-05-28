import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/error";
import { forgotPassword } from "../../../controllers/authController";

const handler = nc({ onError });
dbConnect();

handler.post(forgotPassword);

export default handler;
