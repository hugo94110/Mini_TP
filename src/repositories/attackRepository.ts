import { pool } from "../db.js";
import { Attack } from "../models/Attack.js";
import { NotFoundError } from "../errors/GlobalError.js";

// attack table
type AttackRow = {
    id: number;
    name: string;
    damage: number;
    usage_limit: number;
};

export class AttackRepository {
    public async findAll(): Promise<Attack[]> {
        // the result will have the form of AttackRow
        const result = await pool.query<AttackRow>("select * from attacks order by id");
        return result.rows.map(row => this.toAttack(row));
    }

    public async findById(id: number): Promise<Attack> {
        const result = await pool.query<AttackRow>("select * from attacks where id = $1", [id]);
        const row = result.rows[0];

        if (row === undefined) {
            throw new NotFoundError("Attack", id);
        }

        return this.toAttack(row);
    }

    // create a new attack and return its id
    public async create(attack: Attack): Promise<Attack> {
        const result = await pool.query<AttackRow>("insert into attacks (name, damage, usage_limit) values ($1, $2, $3) returning *", [attack.name, attack.damage, attack.usageLimit]);
        const row = result.rows[0];

        if (row === undefined) {
            throw new Error("Attack creation failed");
        }

        return this.toAttack(row);
    }

    // convert SQL row to Attack object
    private toAttack(row: AttackRow): Attack {
        return new Attack(row.name, row.damage, row.usage_limit, 0, row.id);
    }
}

export const attackRepository = new AttackRepository();