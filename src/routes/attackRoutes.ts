import { Router } from "express";
import { Attack } from "../models/Attack.js";
import { attackRepository } from "../repositories/attackRepository.js";
import { parseId, requireNumber, requireString } from "./validation.js";

export const attackRouter = Router();

// list all attacks
attackRouter.get("/", async (req, res) => {
    const attacks = await attackRepository.findAll();
    res.json(attacks);
});

// list one attack by using his id
attackRouter.get("/:id", async (req, res) => {
    const attack = await attackRepository.findById(parseId(req.params.id));
    res.json(attack);
});

// create an attack
attackRouter.post("/", async (req, res) => {
    let body = req.body;

    if (body === undefined || body === null) {
        body = {};
    }

    // create
    const attack = new Attack(requireString(body, "name"), requireNumber(body, "damage"), requireNumber(body, "usageLimit"));
    const created = await attackRepository.create(attack);
    
    res.status(201).json(created);
});