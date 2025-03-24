// dependencies
import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import postsRoutes from "./routes/posts";
import commentsRoutes from "./routes/comments";
import { errorHandler } from "./errorHandlers";

// initialize express
const app = express();
const PORT = 3000;

// Configuration
app.disable('x-powered-by');
app.disable('etag');

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(json());

// Routes
app.use("/posts", postsRoutes);
app.use("/posts", commentsRoutes);

// Error Handlers
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
