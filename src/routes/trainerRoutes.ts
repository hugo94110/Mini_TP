import { Router } from "express";
import { Pokemon } from "../models/Pokemon.js";
import { Trainer } from "../models/Trainer.js";
import { trainerRepository } from "../repositories/trainerRepository.js";
import { pokemonRepository } from "../repositories/pokemonRepository.js";
import { parseId, requireNumber, requireString } from "./validation.js";

export const trainerRouter = Router();

// list all trainers with their pokemons
trainerRouter.get("/", async (req, res) => {
    const trainers = await trainerRepository.findAll();
    res.json(trainers);
});

// list one trainer by using his id
trainerRouter.get("/:id", async (req, res) => {
    const trainer = await trainerRepository.findById(parseId(req.params.id));
    res.json(trainer);
});

// create a trainer
trainerRouter.post("/", async (req, res) => {
    let body = req.body;

    if (body === undefined || body === null) {
        body = {};
    }

    // by default level 1 and 0xp
    const trainer = new Trainer(requireString(body, "name"));
    const created = await trainerRepository.create(trainer);

    res.status(201).json(created);
});

// add a pokemon to a trainer
trainerRouter.post("/:id/pokemons", async (req, res) => {
    let body = req.body;

    if (body === undefined || body === null) {
        body = {};
    }

    // check if the trainer exist
    const trainerId = parseId(req.params.id);
    await trainerRepository.findById(trainerId);

    // check the rules
    const pokemon = new Pokemon(requireString(body, "name"), requireNumber(body, "lifePoints"));

    // save it for this trainer
    const created = await pokemonRepository.create(pokemon, trainerId);
    
    res.status(201).json(created);
});

// heal all the pokemons of a trainer
trainerRouter.post("/:id/heal", async (req, res) => {
    const trainer = await trainerRepository.findById(parseId(req.params.id));

    trainer.healAllPokemonsAtTavern();

    // save new state
    await trainerRepository.save(trainer);
    
    res.json(trainer);
});