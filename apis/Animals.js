import { SQLite } from '../services/SQLite.js'

SQLite.executeQuerySync({
  "text": `
CREATE TABLE IF NOT EXISTS animals (id INTEGER PRIMARY KEY AUTOINCREMENT, animal VARCHAR(255) UNIQUE, sound VARCHAR(255), icon VARCHAR(255) UNIQUE);
INSERT INTO animals(animal, sound, icon) VALUES 
('Alligator','Snap!','🐊'),
('Lion','Roaar!','🦁'),
('Cat','Meaow!','🐱');`
});

export function insertAnimal({ datasetID, animal, sound, icon }) {
  return SQLite.executeQuery({
    datasetID,
    text: "INSERT INTO animals(animal, sound, icon) VALUES ($1,$2,$3) RETURNING id;",
    values: [animal, sound, icon],
  });
}

export function deleteAnimal({ datasetID, id }) {
  return SQLite.executeQuery({
    datasetID,
    text: "DELETE FROM animals WHERE id=$1;",
    values: [id],
  });
}

export function getAnimals({ datasetID, id }) {
  if (id)
    return SQLite.executeQuery({
      datasetID,
      text: "SELECT * FROM animals WHERE id=$1;",
      values: [id]
    });
  else
    return SQLite.executeQuery({
      datasetID,
      text: "SELECT * FROM animals;",
    });
}
