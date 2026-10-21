import type { Pokemon } from "./Pokemon.js";
import { InvalidTrainerError, PokemonAlreadyOwnedError, NoUsablePokemonError } from "../errors/GlobalError.js";

export class Trainer {
    public readonly id: number | null;
    public readonly name: string;
    private level: number;
    private experience: number;
    private pokemons: Pokemon[];
    static readonly EXPERIENCE_PER_LEVEL = 10;

    constructor(name: string, level: number = 1, experience: number = 0, id: number | null = null) {
        // errors
        if (!name || name.trim() === "") {
            throw new InvalidTrainerError("Name cannot be empty");
        }

        if (level < 1) {
            throw new InvalidTrainerError("Level must be at least 1");
        }

        if (experience < 0 || experience >= Trainer.EXPERIENCE_PER_LEVEL) {
            throw new InvalidTrainerError(`Experience must be between 0 and ${Trainer.EXPERIENCE_PER_LEVEL - 1}`);
        }

        this.id = id;
        this.name = name;
        this.level = level;
        this.experience = experience;
        this.pokemons = [];
    }

    // Getters
    public getLevel(): number {
        return this.level;
    }

    public getExperience(): number {
        return this.experience;
    }

    public getPokemons(): readonly Pokemon[] {
        return this.pokemons;
    }

    ///////
    public addPokemon(pokemon: Pokemon): void {
        if (this.pokemons.includes(pokemon)) {
            throw new PokemonAlreadyOwnedError(this.name, pokemon.name);
        }

        this.pokemons.push(pokemon);
    }

    public healAllPokemonsAtTavern(): void {
        // loop to heal all pokemons
        for (const pokemon of this.getPokemons()) {
            pokemon.heal();
        }
    }

    public gainExperience(amount: number): void {
        if (amount < 0) {
            throw new InvalidTrainerError("Experience amount cannot be negative");
        }

        this.experience += amount;

        //// level up as long as there is enough experience
        while (this.experience >= Trainer.EXPERIENCE_PER_LEVEL) {
            this.experience -= Trainer.EXPERIENCE_PER_LEVEL;
            this.level++;
        }
    }

    public getAlivePokemons(): Pokemon[] {
        return this.pokemons.filter(p => p.isAlive());
    }

    public hasAlivePokemon(): boolean {
        return this.pokemons.some(p => p.isAlive());
    }
    
    public getRandomPokemon(): Pokemon {
        const index = Math.floor(Math.random() * this.pokemons.length);
        const pokemon = this.pokemons[index];

        if (pokemon === undefined) {
            throw new NoUsablePokemonError(this.name);
        }

        return pokemon;
    }

    public getBestPokemon(): Pokemon {
        const alivePokemons = this.getAlivePokemons();
        let best = alivePokemons[0];

        if (best === undefined) {
            throw new NoUsablePokemonError(this.name);
        }

        ////////
        for (const pokemon of alivePokemons) {
            if (pokemon.getLifePoints() > best.getLifePoints()) {
                best = pokemon;
            }
        }
        return best;
    }

    public showInfo(): string {
        return `${this.name} - Level ${this.level} (${this.experience}/${Trainer.EXPERIENCE_PER_LEVEL} XP) - ${this.pokemons.length} pokemon(s)`;
    }
}