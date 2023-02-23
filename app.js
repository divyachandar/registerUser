const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "userData.db");
let db = null;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//API 1
//Register User details
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username=${username}`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    //Register user
    const createUserQuery = `INSERT INTO user(username,name,password,gender,location)
    VALUES('${username}','${name}','${hashedPassword},'${gender},'${location}');`;
    await db.run(createUserQuery);
    response.send("Successful registration of the registrant");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
module.exports = app;
