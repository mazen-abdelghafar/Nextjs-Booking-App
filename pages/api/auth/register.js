import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/error";
import { registerUser } from "../../../controllers/authController";

const handler = nc({ onError });
dbConnect();

handler.post(registerUser);

export default handler;
