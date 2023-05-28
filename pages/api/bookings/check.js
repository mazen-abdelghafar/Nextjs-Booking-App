import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/error";
import { checkRoomBookingsAvailability } from "../../../controllers/bookingController";

const handler = nc({ onError });
dbConnect();

handler.get(checkRoomBookingsAvailability);

export default handler;
