import { pool } from "../db.js";
import { Trainer } from "../models/Trainer.js";
import { NotFoundError } from "../errors/GlobalError.js";
import { pokemonRepository } from "./pokemonRepository.js";

// trainer table
type TrainerRow = {
    id: number;
    name: string;
    level: number;
    experience: number;
};

export class TrainerRepository {
    public async findAll(): Promise<Trainer[]> {
        const result = await pool.query<TrainerRow>("select * from trainers order by id");
        return Promise.all(result.rows.map(row => this.toTrainer(row)));
    }

    public async findById(id: number): Promise<Trainer> {
        const result = await pool.query<TrainerRow>("select * from trainers where id = $1", [id]);
        const row = result.rows[0];
    
        if (row === undefined) {
            throw new NotFoundError("Trainer", id);
        }
    
        return this.toTrainer(row);
    }

    // create a new trainer and return it
    public async create(trainer: Trainer): Promise<Trainer> {
        const result = await pool.query<TrainerRow>("insert into trainers (name, level, experience) values ($1, $2, $3) returning *", [trainer.name, trainer.getLevel(), trainer.getExperience()]);
        const row = result.rows[0];
        
        if (row === undefined) {
            throw new Error("Trainer creation failed");
        }
        
        return this.toTrainer(row);
    }

    // save state
    public async save(trainer: Trainer): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query("begin");

            // trainer level and xp
            await client.query("update trainers set level = $1, experience = $2 where id = $3", [trainer.getLevel(), trainer.getExperience(), trainer.id]);

            // pokemons
            for (const pokemon of trainer.getPokemons()) {
                // HP
                await client.query("update pokemons set life_points = $1 where id = $2", [pokemon.getLifePoints(), pokemon.id]);
            
                // attacks of the pokemon
                for (const attack of pokemon.getAttacks()) {
                    // usage count
                    await client.query("update pokemon_attacks set usage_count = $1 where pokemon_id = $2 and attack_id = $3", [attack.getUsageCount(), pokemon.id, attack.id]);
                }
            }

            await client.query("commit");
        } catch(error) {
            await client.query("rollback");
            throw error;
        } finally {
            client.release();
        }
    }

    ////////////
    private async toTrainer(row: TrainerRow): Promise<Trainer> {
        const trainer = new Trainer(row.name, row.level, row.experience, row.id);

        const pokemons = await pokemonRepository.findByTrainerId(row.id);
        for (const pokemon of pokemons) {
            trainer.addPokemon(pokemon);
        }

        return trainer;
    }
}

export const trainerRepository = new TrainerRepository();