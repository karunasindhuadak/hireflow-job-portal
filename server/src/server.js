import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed !! ", error);
  });
