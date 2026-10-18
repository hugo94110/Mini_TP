export class GlobalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

// Attack.ts
export class UsageLimitReachedError extends GlobalError {
    constructor(attackName: string) {
        super(`${attackName} has reached its usage limit`);
    }
}

export class InvalidAttackError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}