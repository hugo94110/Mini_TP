import { Battle, type BattleResult } from "./Battle.js";
import { DeterministicChallenge } from "./DeterministicChallenge.js";
import type { Trainer } from "../models/Trainer.js";

export class Arena2 extends Battle {
    public override start(): BattleResult {
        let wins1 = 0;
        let wins2 = 0;

        for (let i=1; i<=100; i++) {
            // stop when trainer has lost all his pokemons
            if (!this.trainer1.hasAlivePokemon()) {
                this.log.push(`${this.trainer1.name} has no pokemon left. The arena stops after ${i-1} fights`);
                break;
            }
            if (!this.trainer2.hasAlivePokemon()) {
                this.log.push(`${this.trainer2.name} has no pokemon left. The arena stops after ${i-1} fights`);
                break;
            }

            // deter challenge
            const result = new DeterministicChallenge(this.trainer1, this.trainer2).start();
            this.log.push(`Battle ${i}: ${result.winner?.name} wins against ${result.loser?.name}`);

            // add win
            if (result.winner === this.trainer1) {
                wins1++;
            }
            if (result.winner === this.trainer2) {
                wins2++;
            }
        }

        // sum
        this.log.push(`${this.trainer1.name} : ${wins1} wins - ${this.trainer2.name} : ${wins2} wins`);

        let winner: Trainer | null;
        // trainer with no pokemon lose and trainer with the most wins win
        if (!this.trainer1.hasAlivePokemon()) {
            winner = this.trainer2;
        } else if (!this.trainer2.hasAlivePokemon()) {
            winner = this.trainer1;
        } else if (wins1 > wins2) {
            winner = this.trainer1;
        } else if (wins2 > wins1) {
            winner = this.trainer2;
        } else {
            winner = null;
        }

        if (winner !== null) {
            this.log.push(`${winner.name} wins the arena`);
        } else {
            this.log.push("Draw");
        }

        return this.buildBattleResult(winner);
    }
}