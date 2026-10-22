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

// Pokemon.ts
export class MaxAttacksReachedError extends GlobalError {
    constructor(pokemonName: string, maxAttacks: number) {
        super(`${pokemonName} cannot learn more than ${maxAttacks} attacks`);
    }
}

export class AttackAlreadyKnownError extends GlobalError {
    constructor(pokemonName: string, attackName: string) {
        super(`${pokemonName} already knows the attack ${attackName}`);
    }
}

export class NoUsableAttackError extends GlobalError {
    constructor(pokemonName: string) {
        super(`${pokemonName} has no usable attack left`);
    }
}

export class InvalidPokemonError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}

// Trainer.ts
export class PokemonAlreadyOwnedError extends GlobalError {
    constructor(trainerName: string, pokemonName: string) {
        super(`${trainerName} already owns ${pokemonName}`);
    }
}

export class NoUsablePokemonError extends GlobalError {
    constructor(trainerName: string) {
        super(`${trainerName} has no usable Pokemon left`);
    }
}

export class InvalidTrainerError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}

// API
export class NotFoundError extends GlobalError {
    constructor(entity: string, id: number) {
        super(`${entity} ${id} not found`);
    }
}

export class InvalidRequestError extends GlobalError {
    constructor(message: string) {
        super(message);
    }
}