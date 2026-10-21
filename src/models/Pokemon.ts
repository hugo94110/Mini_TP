import type { Attack } from "./Attack.js";
import { MaxAttacksReachedError, AttackAlreadyKnownError, NoUsableAttackError, InvalidPokemonError } from "../errors/GlobalError.js";

export class Pokemon {
    public readonly id: number | null;
    public readonly name: string;
    private lifePoints: number;
    public readonly maxLifePoints: number;
    private attacks: Attack[];
    static readonly MAX_ATTACKS = 4;

    constructor(name: string, maxLifePoints: number, lifePoints: number = maxLifePoints, id: number | null = null) {
        if (!name || name.trim() === "") {
            throw new InvalidPokemonError("Name cannot be empty");
        }

        if (maxLifePoints <= 0) {
            throw new InvalidPokemonError("Life points must be greater than 0");
        }

        if (lifePoints < 0 || lifePoints > maxLifePoints) {
            throw new InvalidPokemonError(`Life points must be between 0 and ${maxLifePoints}`);
        }

        this.id = id;
        this.name = name;
        this.lifePoints = lifePoints;
        this.maxLifePoints = maxLifePoints;
        this.attacks = [];
    }

    // Getters
    public getLifePoints(): number {
        return this.lifePoints;
    }

    public getAttacks(): readonly Attack[] {
        return this.attacks;
    }

    ///////////////////////
    public learnAttack(attack: Attack): void {
        if (this.attacks.length >= Pokemon.MAX_ATTACKS) {
            throw new MaxAttacksReachedError(this.name, Pokemon.MAX_ATTACKS);
        }

        if (this.attacks.some(a => a.name === attack.name)) {
            throw new AttackAlreadyKnownError(this.name, attack.name);
        }
        this.attacks.push(attack);
    }

    public heal(): void {
        this.lifePoints = this.maxLifePoints;
        for (const attack of this.attacks) {
            attack.resetUsageCount();
        }
    }

    public takeDamage(damage: number): void {
        this.lifePoints = Math.max(0, this.lifePoints - damage);
    }

    public attack(target: Pokemon): Attack {
        const usableAttacks = this.attacks.filter(a => a.isUsable());

        // choose a random attack from the usable attacks
        const randomIndex = Math.floor(Math.random() * usableAttacks.length);
        const chosenAttack = usableAttacks[randomIndex];

        if (chosenAttack === undefined) {
            throw new NoUsableAttackError(this.name);
        }

        chosenAttack.use();
        target.takeDamage(chosenAttack.damage);
        return chosenAttack;
    }

    // used to check if the pokemon can attack and determine the winner
    public canAttack(): boolean {
        return this.attacks.some(a => a.isUsable());
    }

    public isAlive(): boolean {
        if (this.lifePoints <= 0) {
            return false;
        }
        return true;
    }
    
    public showInfo(): string {
        return `${this.name} - ${this.lifePoints}/${this.maxLifePoints} HP - ${this.attacks.length}/${Pokemon.MAX_ATTACKS} attacks`;
    }
}