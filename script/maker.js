require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../src/utils/db");
const { promisify } = require("util");
const read = promisify(fs.readFile);
const dataPath = path.join(__dirname, "../data/marketplace.sql");

const insertData = async () => {
  try {
    const data = await read(dataPath);
    const sqlQueryString = data.toString();
    await db.query(sqlQueryString);
    console.info("Successfully added data");
  } catch (e) {
    console.error("FAILED");
    console.log(e);
  }
  db.pool.end();
};

insertData();