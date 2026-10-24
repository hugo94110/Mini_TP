DROP TABLE IF EXISTS pokemon_attacks;
DROP TABLE IF EXISTS pokemons;
DROP TABLE IF EXISTS attacks;
DROP TABLE IF EXISTS trainers;

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0
);

CREATE TABLE attacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    damage INTEGER,
    usage_limit INTEGER
);

CREATE TABLE pokemons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    life_points INTEGER,
    max_life_points INTEGER,
    trainer_id INTEGER REFERENCES trainers(id)
);

CREATE TABLE pokemon_attacks (
    pokemon_id INTEGER REFERENCES pokemons(id),
    attack_id INTEGER REFERENCES attacks(id),
    usage_count INTEGER DEFAULT 0,
    PRIMARY KEY (pokemon_id, attack_id)
);