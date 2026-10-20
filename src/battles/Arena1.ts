import { Battle, type BattleResult } from "./Battle.js";
import { RandomChallenge } from "./RandomChallenge.js";

export class Arena1 extends Battle {
    public override start(): BattleResult {
        // 100 battles
        for (let i=1; i<=100; i++) {
            const result = new RandomChallenge(this.trainer1, this.trainer2).start();
            this.log.push(`Battle ${i} : ${result.winner?.name} wins against ${result.loser?.name}`);
        }

        //////////
        if (this.trainer1.getLevel() > this.trainer2.getLevel()) {
            return this.buildBattleResult(this.trainer1);
        }
        if (this.trainer2.getLevel() > this.trainer1.getLevel()) {
            return this.buildBattleResult(this.trainer2);
        }
        if (this.trainer1.getExperience() > this.trainer2.getExperience()) {
            return this.buildBattleResult(this.trainer1);
        }
        if (this.trainer2.getExperience() > this.trainer1.getExperience()) {
            return this.buildBattleResult(this.trainer2);
        }
        return this.buildBattleResult(null);
    }
}