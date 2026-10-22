import { pool } from "../db.js";
import { Attack } from "../models/Attack.js";
import { Pokemon } from "../models/Pokemon.js";
import { NotFoundError } from "../errors/GlobalError.js";

// pokemon table
type PokemonRow = {
    id: number;
    name: string;
    life_points: number;
    max_life_points: number;
    trainer_id: number;
};

// attack known by a pokemon
type PokemonAttackRow = {
    id: number;
    name: string;
    damage: number;
    usage_limit: number;
    usage_count: number;
};

export class PokemonRepository {
    public async findAll(): Promise<Pokemon[]> {
        const result = await pool.query<PokemonRow>("select * from pokemons order by id");
        return Promise.all(result.rows.map(row => this.toPokemon(row)));
    }

    public async findById(id: number): Promise<Pokemon> {
        const result = await pool.query<PokemonRow>("select * from pokemons where id = $1", [id]);
        const row = result.rows[0];
        
        if (row === undefined) {
            throw new NotFoundError("Pokemon", id);
        }
        
        return this.toPokemon(row);
    }

    // Get all pokemons of one trainer
    public async findByTrainerId(trainerId: number): Promise<Pokemon[]> {
        const result = await pool.query<PokemonRow>("select * from pokemons where trainer_id = $1 order by id", [trainerId]);
        return Promise.all(result.rows.map(row => this.toPokemon(row)));
    }

    // create a new pokemon for a trainer and return it
    public async create(pokemon: Pokemon, trainerId: number): Promise<Pokemon> {
        const result = await pool.query<PokemonRow>("insert into pokemons (name, life_points, max_life_points, trainer_id) values ($1, $2, $3, $4) returning *", [pokemon.name, pokemon.getLifePoints(), pokemon.maxLifePoints, trainerId]);
        const row = result.rows[0];
    
        if (row === undefined) {
            throw new Error("Pokemon creation failed");
        }
    
        return this.toPokemon(row);
    }

    // link an attack to a pokemon
    public async addAttack(pokemonId: number, attackId: number): Promise<void> {
        await pool.query("insert into pokemon_attacks (pokemon_id, attack_id) values ($1, $2)", [pokemonId, attackId]);
    }

    /////////////
    private async toPokemon(row: PokemonRow): Promise<Pokemon> {
        const pokemon = new Pokemon(row.name, row.max_life_points, row.life_points, row.id);

        // search attacks
        const result = await pool.query<PokemonAttackRow>("select attacks.id, attacks.name, attacks.damage, attacks.usage_limit, pokemon_attacks.usage_count from pokemon_attacks join attacks on attacks.id = pokemon_attacks.attack_id where pokemon_attacks.pokemon_id = $1 order by attacks.id", [row.id]);
        
        // learn attacks
        for (const attackRow of result.rows) {
            const attack = new Attack(attackRow.name, attackRow.damage, attackRow.usage_limit, attackRow.usage_count, attackRow.id);
            pokemon.learnAttack(attack);
        }

        return pokemon;
    }
}

export const pokemonRepository = new PokemonRepository();