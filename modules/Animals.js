import { executeQuery } from './SQLite.js'

export function createTables() {
  return executeQuery({
    "text": "CREATE TABLE IF NOT EXISTS animals (id INTEGER PRIMARY KEY AUTOINCREMENT, animal VARCHAR(255) UNIQUE);"
  });
}

export function insertAnimal(animal) {
  return executeQuery({
    text: "INSERT INTO animals(animal) VALUES ($1);",
    values: [animal],
  });
}

export function getAnimals(id) {
  if (id) {
    executeQuery({
      text: "SELECT * FROM animals WHERE id = $1;",
      values: [id]
    });
  } else {
    executeQuery({
      text: "SELECT * FROM animals;",
    });
  }
}
