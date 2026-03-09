import "dotenv/config"
import app from "./src/app.js"
import connectDB from "./src/db/db.js"

const port = process.env.PORT || 3000

connectDB()

app.listen(port, () => {
    console.log(`server is running on port 3000`);
});
