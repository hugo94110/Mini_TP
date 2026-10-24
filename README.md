# Mini TP Pokemon

REST API in Express, TypeScript and PostgreSQL

## Requirements

- Node.js 22+
- PostgreSQL
- pgAdmin 4 (optional)

## Installation

```bash
npm install
```

Copy `.env.example` to `.env` and fill it.

## Database

- Create a database named `pokemon` on pgAdmin 4
- Use `sql/schema.sql` with Query Tool

## Run

```bash
npm run dev
```

## Routes

| Method | Route | Body |
|---|---|---|
| GET | `/trainers` - `/trainers/:id` | |
| POST | `/trainers` | `{ "name" }` |
| POST | `/trainers/:id/pokemons` | `{ "name", "lifePoints" }` |
| POST | `/trainers/:id/heal` | |
| GET | `/pokemons` - `/pokemons/:id` | |
| POST | `/pokemons/:id/learn` | `{ "attackId" }` |
| GET | `/attacks` - `/attacks/:id` | |
| POST | `/attacks` | `{ "name", "damage", "usageLimit" }` |
| POST | `/battles/:mode` | `{ "trainer1Id", "trainer2Id" }` |

Battle modes : `random`, `arena1`, `deterministic`, `arena2`

## Notes

A pokemon needs at least one attack to fight.