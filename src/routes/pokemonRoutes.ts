import { Router } from "express";
import { attackRepository } from "../repositories/attackRepository.js";
import { pokemonRepository } from "../repositories/pokemonRepository.js";
import { parseId, requireNumber, requireString } from "./validation.js";

export const pokemonRouter = Router();

// list all pokemons with their attacks
pokemonRouter.get("/", async (req, res) => {
    const pokemons = await pokemonRepository.findAll();
    res.json(pokemons);
});

// list one pokemon by using his id
pokemonRouter.get("/:id", async (req, res) => {
    const pokemon = await pokemonRepository.findById(parseId(req.params.id));
    res.json(pokemon);
});

// pokemon learn attack
pokemonRouter.post("/:id/learn", async (req, res) => {
    let body = req.body;

    if (body === undefined || body === null) {
        body = {};
    }

    ////
    const pokemonId = parseId(req.params.id);
    const attackId = requireNumber(body, "attackId");

    const pokemon = await pokemonRepository.findById(pokemonId);
    const attack = await attackRepository.findById(attackId);

    // Game rule check (max 4 attacks, no dupli)
    pokemon.learnAttack(attack);

    // if game rule check ok save into db
    await pokemonRepository.addAttack(pokemonId, attackId);

    res.status(201).json(await pokemonRepository.findById(pokemonId));
});