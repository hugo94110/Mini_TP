import { Router } from "express";
import type { Battle } from "../battles/Battle.js";
import { RandomChallenge } from "../battles/RandomChallenge.js";
import { Arena1 } from "../battles/Arena1.js";
import { DeterministicChallenge } from "../battles/DeterministicChallenge.js";
import { Arena2 } from "../battles/Arena2.js";
import type { Trainer } from "../models/Trainer.js";
import { trainerRepository } from "../repositories/trainerRepository.js";
import { InvalidRequestError } from "../errors/GlobalError.js";
import { parseId, requireNumber, requireString } from "./validation.js";

export const battleRouter = Router();

// create battle mode
function createBattle(mode: string, trainer1: Trainer, trainer2: Trainer): Battle {
    switch(mode) {
        case "random":
            return new RandomChallenge(trainer1, trainer2);
        case "arena1":
            return new Arena1(trainer1, trainer2);
        case "deterministic":
            return new DeterministicChallenge(trainer1, trainer2);
        case "arena2":
            return new Arena2(trainer1, trainer2);
        default:
            throw new InvalidRequestError(`Unknown battle mode : ${mode}`);
    }
}

// start battle
battleRouter.post("/:mode", async (req, res) => {
    let body = req.body;
    if (body === undefined || body === null) {
        body = {};
    }

    const trainer1Id = parseId(body.trainer1Id);
    const trainer2Id = parseId(body.trainer2Id);

    if (trainer1Id === trainer2Id) {
        throw new InvalidRequestError("Both opponents must have different IDs");
    }

    const trainer1 = await trainerRepository.findById(trainer1Id);
    const trainer2 = await trainerRepository.findById(trainer2Id);

    const battle = createBattle(req.params.mode, trainer1, trainer2);
    const result = battle.start();

    // save the new state of trainers
    await trainerRepository.save(trainer1);
    await trainerRepository.save(trainer2);


    // Get winner name and loser name
    let winnerName = null;
    if (result.winner !== null) {
        winnerName = result.winner.name;
    }

    let loserName = null;
    if (result.loser !== null) {
        loserName = result.loser.name;
    }

    // res
    res.json({
        winner: winnerName,
        loser: loserName,
        log: result.log,
        trainers: [trainer1, trainer2]
    });
});