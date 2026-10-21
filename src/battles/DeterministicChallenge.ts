import { Battle, type BattleResult } from "./Battle.js";

export class DeterministicChallenge extends Battle {
    public override start(): BattleResult {
        // No tavern + choose best pokemon (with most life points)
        const pokemon1 = this.trainer1.getBestPokemon();
        const pokemon2 = this.trainer2.getBestPokemon();
        this.log.push(`${this.trainer1.name} sends ${pokemon1.name} (${pokemon1.getLifePoints()} HP)`);
        this.log.push(`${this.trainer2.name} sends ${pokemon2.name} (${pokemon2.getLifePoints()} HP)`);
        
        const pokemonWinner = this.duel(pokemon1, pokemon2);
        const winner = this.getOwner(pokemonWinner);
        winner.gainExperience(3); // 3xp
        this.log.push(`${winner.name} wins the battle (Deterministic Challenge)`);

        return this.buildBattleResult(winner);
    }
}