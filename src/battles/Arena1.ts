import { Battle, type BattleResult } from "./Battle.js";
import { RandomChallenge } from "./RandomChallenge.js";
import type { Trainer } from "../models/Trainer.js";

export class Arena1 extends Battle {
    public override start(): BattleResult {
        // 100 battles
        for (let i=1; i<=100; i++) {
            const result = new RandomChallenge(this.trainer1, this.trainer2).start();
            this.log.push(`Battle ${i} : ${result.winner?.name} wins against ${result.loser?.name}`);
        }

        //////////
        this.log.push(`${this.trainer1.showInfo()} - ${this.trainer2.showInfo()}`);

        let winner: Trainer | null;
        if (this.trainer1.getLevel() > this.trainer2.getLevel()) {
            winner = this.trainer1;
        } else if (this.trainer2.getLevel() > this.trainer1.getLevel()) {
            winner = this.trainer2;
        } else if (this.trainer1.getExperience() > this.trainer2.getExperience()) {
            winner = this.trainer1;
        } else if (this.trainer2.getExperience() > this.trainer1.getExperience()) {
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