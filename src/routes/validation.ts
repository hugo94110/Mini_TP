import { InvalidRequestError } from "../errors/GlobalError.js";

// error if not a positive int
export function parseId(value: unknown): number {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw new InvalidRequestError(`Invalid id : ${value}`);
    }
    return id;
}

// read text field from the request body
export function requireString(body: Record<string, unknown>, field: string): string {
    const value = body[field];

    if (typeof value !== "string") {
        throw new InvalidRequestError(`Field "${field}" is required and must be a string`);
    }
    return value;
}

// read a number field from the request body
export function requireNumber(body: Record<string, unknown>, field: string): number {
    const value = body[field];

    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new InvalidRequestError(`Field "${field}" is required and must be a number`);
    }
    return value;
}