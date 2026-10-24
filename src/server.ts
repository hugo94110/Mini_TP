import express, { type ErrorRequestHandler } from "express";
import { GlobalError, NotFoundError } from "./errors/GlobalError.js";
import { attackRouter } from "./routes/attackRoutes.js";
import { pokemonRouter } from "./routes/pokemonRoutes.js";
import { trainerRouter } from "./routes/trainerRoutes.js";
import { battleRouter } from "./routes/battleRoutes.js";

const app = express();
const port = Number(process.env.PORT);

app.use(express.json());

// routes
app.use("/attacks", attackRouter);
app.use("/pokemons", pokemonRouter);
app.use("/trainers", trainerRouter);
app.use("/battles", battleRouter);

// unknown route 404
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found`});
});

// error handler
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof NotFoundError) {
        res.status(404).json({error: error.message});
    } else if (error instanceof GlobalError) {
        res.status(400).json({error: error.message}); // client error
    } else {
        console.error(error);
        res.status(500).json({error: "Internal server error"}); // internal problem
    }
};
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});