import express from "express";
import cors from "cors";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import dotenv from "dotenv";
import db from "./config/Database.js";
import userRouter from "./routes/UserRoute.js";
import productRouter from "./routes/ProductRoute.js";
import authRouter from "./routes/AuthRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// (async () => {
//   try {
//     await db.sync({ force: true });
//     console.log("Database synchronized successfully!");
//   } catch (error) {
//     console.error("Error synchronizing the database:", error);
//   }
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    store: store,
    saveUninitialized: true,
    cookie: { secure: "auto" },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.get("/", (req, res) => res.send("Welcome to user api"));
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use(authRouter);
// store.sync();
app.listen(port, () => console.log(`Server running at port ${port}`));
