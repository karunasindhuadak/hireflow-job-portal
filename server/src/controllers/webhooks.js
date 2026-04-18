import { Webhook } from "svix";
import User from "../models/user.model.js";

// Api controller function to manage clerk user with database
const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with the clerk webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify Headers
    await wh.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-timestamp": req.headers["svix-timestamp"],
    });

    // Getting data and type from the request body
    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Webhooks Error" });
  }
};

export { clerkWebhooks };
