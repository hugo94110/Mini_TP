import type { Pokemon } from "../models/Pokemon.js";
import type { Trainer } from "../models/Trainer.js";

////////////
export type BattleResult = {
    winner: Trainer | null;
    loser: Trainer | null;
    log: string[];
};

export abstract class Battle {
    protected readonly trainer1: Trainer;
    protected readonly trainer2: Trainer;
    protected log: string[];

    constructor(trainer1: Trainer, trainer2: Trainer) {
        this.trainer1 = trainer1;
        this.trainer2 = trainer2;
        this.log = [];
    }

    // every battle mode implement its own method
    public abstract start(): BattleResult;

    // duel between 2 pokemons
    protected duel(pokemon1: Pokemon, pokemon2: Pokemon): Pokemon {
        let attacker = pokemon1;
        let defender = pokemon2;

        while (true) {
            if (!attacker.canAttack()) {
                this.log.push(`${attacker.name} has no usable attack left`);
                return defender; // defender win
            }

            const attack = attacker.attack(defender);
            this.log.push(`${attacker.name} uses ${attack.name} on ${defender.name} causing ${attack.damage} damage`);
        
            if (!defender.isAlive()) {
                this.log.push(`${defender.name} is defeated !`);
                return attacker; // attacker win
            }

            // swap
            [attacker, defender] = [defender, attacker];
        }
    }

    // used to get the owner of the pokemon to determine the winner
    protected getOwner(pokemon: Pokemon): Trainer {
        if (this.trainer1.getPokemons().includes(pokemon)) {
            return this.trainer1;
        }
        return this.trainer2;
    }

    protected buildBattleResult(winner: Trainer | null): BattleResult {
        let loser: Trainer | null = null;

        if (winner === this.trainer1) {
            loser = this.trainer2;
        } else if (winner === this.trainer2) {
            loser = this.trainer1;
        }

        return {
            winner: winner,
            loser: loser,
            log: this.log
        };
    }
}