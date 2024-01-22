importScripts('sqlite3.js');

var db;

sqlite3InitModule().then(function (sqlite3) {
  if (sqlite3.opfs) {
    db = new sqlite3.oo1.OpfsDb('test.sqlite3')
    db.exec([
      "CREATE TABLE IF NOT EXISTS templates(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE);",
      "CREATE TABLE IF NOT EXISTS properties(tid INTEGER NOT NULL REFERENCES templates(id), name VARCHAR(255) NOT NULL, value VARCHAR(255) NOT NULL);",
      "CREATE TABLE IF NOT EXISTS rules(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE, type VARCHAR(255) NOT NULL, atid INTEGER NOT NULL REFERENCES templates(id), btid INTEGER REFERENCES templates(id), stid INTEGER REFERENCES templates(id), vtid INTEGER REFERENCES templates(id), n INTEGER, current INTEGER, state VARCHAR(255), mtrans VARCHAR(255), utrans VARCHAR(255));",
      "CREATE TABLE IF NOT EXISTS listeners(property VARCHAR(255), tid INTEGER REFERENCES templates(id), rid INTEGER REFERENCES rules(id));",
      "CREATE TABLE IF NOT EXISTS notlisteners(property VARCHAR(255), tid INTEGER REFERENCES templates(id), rid INTEGER REFERENCES rules(id));",
      "CREATE TABLE IF NOT EXISTS events (timestamp TIMESTAMP NOT NULL, json VARCHAR(255) NOT NULL);"
    ]);
  }
});

onmessage = function messageReceived({ data }) {
  switch(data.type) {
    case "event":
      // TODO: verify event
      insertEvent(data.event)
      break;
    case "rule":
      // TODO: verify rule
      insertRule(data.rule)
      break;
    case "template":
      // TODO: verify template
      insertTemplate(data.template)
      break;
    default:
      console.log(data)
  }
}

function executeQuery({ text, values }) {
  var queryString = text;
  if (values) {
    values.forEach(function replacePlaceholder(item, index) {
      queryString = queryString.replace("$" + (index + 1), `'${item}'`);
    });
  }
  console.log(queryString)
  return db.exec({sql: queryString, returnValue:"resultRows"})
}

function insertEvent(event) {
  executeQuery({
    text:"INSERT INTO events(timestamp, json) VALUES ((SELECT UNIXEPOCH()), $1)",
    values: [JSON.stringify(event)],
  });
}

function insertRule({name, type, atid, btid, stid, vtid}) {
  // TODO: check if TemplateA and TemplateB are equal, not only ID, but also content
  executeQuery({
    text: "INSERT INTO rules(name, type, atid, btid, stid, vtid, n, state, mtrans, utrans) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
    values: [
      name,
      type.type,
      atid,
      btid,
      stid,
      vtid,
      type.n],
  });
}

function insertTemplate({ name, eventpattern }) {
  var step1 = executeQuery({
    text: "INSERT INTO templates(name) VALUES ($1) RETURNING id",
    values: [name],
  });
  let tid = step1[0][0];
  if (tid && tid != 0) {
    var propertiesString = "";
    Object.keys(eventpattern).forEach(function collectProperties(property, index, array) {
      propertiesString = propertiesString.concat(
        `(${tid},'${property}','${eventpattern[property]}')`
      );
      if (index < array.length - 1) {
        propertiesString = propertiesString.concat(",");
      }
    });
    executeQuery({
      text: "INSERT INTO properties(tid, name, value) VALUES " + propertiesString,
    })
  }
}
