import { Battle, type BattleResult } from "./Battle.js";

export class RandomChallenge extends Battle {
    public override start(): BattleResult {
        // heal all pokemons
        this.trainer1.healAllPokemonsAtTavern();
        this.trainer2.healAllPokemonsAtTavern();

        // random pokemon
        const pokemon1 = this.trainer1.getRandomPokemon();
        const pokemon2 = this.trainer2.getRandomPokemon();
        this.log.push(`${this.trainer1.name} sends ${pokemon1.name}`);
        this.log.push(`${this.trainer2.name} sends ${pokemon2.name}`);

        const pokemonWinner = this.duel(pokemon1, pokemon2);
        const winner = this.getOwner(pokemonWinner);
        winner.gainExperience(5); // 5xp
        this.log.push(`${winner.name} wins the battle (Random Challenge)`);

        return this.buildBattleResult(winner);
    }
}