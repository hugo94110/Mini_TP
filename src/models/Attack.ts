import { UsageLimitReachedError } from "../errors/GlobalError.js";

export class Attack {
    public readonly name: string;
    public readonly damage: number;
    public readonly usageLimit: number;
    private usageCount: number;

    constructor(name: string, damage: number, usageLimit: number) {
        if (!name || name.trim() === "") {
            throw new Error("Name cannot be empty");
        }

        if (damage < 0) {
            throw new Error("Damage cannot be negative");
        }

        if (usageLimit <= 0) {
            throw new Error("Usage limit cannot be zero or negative");
        }

        this.name = name;
        this.damage = damage;
        this.usageLimit = usageLimit;
        this.usageCount = 0;
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