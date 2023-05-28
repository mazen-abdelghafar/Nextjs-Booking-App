import nc from "next-connect";
import dbConnect from "../../config/dbConnect";
import onError from "../../middlewares/error";
import { webhookCheckout } from "../../controllers/paymentController";

const handler = nc({ onError });
dbConnect();

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.post(webhookCheckout);

export default handler;
