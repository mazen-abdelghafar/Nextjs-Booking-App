import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/error";
import { checkBookedDatesOfRoom } from "../../../controllers/bookingController";

const handler = nc({ onError });
dbConnect();

handler.get(checkBookedDatesOfRoom);

export default handler;
