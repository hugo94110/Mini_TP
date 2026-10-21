import { UsageLimitReachedError, InvalidAttackError } from "../errors/GlobalError.js";

export class Attack {
    public readonly id: number | null;
    public readonly name: string;
    public readonly damage: number;
    public readonly usageLimit: number;
    private usageCount: number;

    constructor(name: string, damage: number, usageLimit: number, usageCount: number = 0, id: number | null = null) {
        if (!name || name.trim() === "") {
            throw new InvalidAttackError("Name cannot be empty");
        }

        if (damage < 0) {
            throw new InvalidAttackError("Damage cannot be negative");
        }

        if (usageLimit <= 0) {
            throw new InvalidAttackError("Usage limit cannot be zero or negative");
        }

        if (usageCount < 0 || usageCount > usageLimit) {
            throw new InvalidAttackError(`Usage count must be between 0 and ${usageLimit}`);
        }

        this.id = id;
        this.name = name;
        this.damage = damage;
        this.usageLimit = usageLimit;
        this.usageCount = usageCount;
    }

    // Getters
    public getUsageCount(): number {
        return this.usageCount;
    }

    ////////////////////
    public isUsable(): boolean {
        return this.usageCount < this.usageLimit;
    }
    
    public resetUsageCount(): void {
        this.usageCount = 0;
    }

    public use(): void {
        if (!this.isUsable()) {
            throw new UsageLimitReachedError(this.name); // limit reached
        }
        this.usageCount++; // success
    }

    public showInfo(): string {
        return `${this.name} - ${this.damage} damage - ${this.usageCount}/${this.usageLimit} uses`;
    }
}