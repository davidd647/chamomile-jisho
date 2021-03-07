const express = require("express");
const cors = require("cors");

// mysql:

//  MySQL Workbench
//  127.0.0.1:3306 ... ???????? maybe 192.168.64.2, actually?
//  schema: test
//  Tables (none exist yet)

// XAMPP
// https://www.youtube.com/watch?v=EN6Dx22cPRI&ab_channel=TraversyMedia
//  192.168.64.2 ???
//  localhost:8080/phpmyadmin
// const mysql = require("mysql");

const jishoApi = require("unofficial-jisho-api");
const jisho = new jishoApi();

const app = express();

app.use(cors());

// Create connection
// const db = mysql.createConnection({
//   // example didn't have the port... but I added it?
//   host: "localhost:8080",
//   // is this who I am? I think so...
//   user: "root",
//   // this is definitely not my password, heh
//   // password: "123456",
//   // I think this is the only input that might be right!
//   // database: "test",
// });

// Connect
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("MySQL Connected...");
// });

// Create DB
// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE nodemysqldb";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send("database created");
//   });
// });

app.get("/", (req, res) => {
  res.send("This is not the page you're looking for 👋");
});

app.get("/search", (req, res) => {
  console.log("req.query.term");
  console.log(req.query.term);
  const searchTerm = req.query.term;

  jisho.searchForPhrase(searchTerm).then((result) => {
    let kanji, furigana, english;

    console.log("˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰");
    console.log("searchTerm: " + searchTerm);
    console.log("˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰˰");
    // console.log(result.data);

    if (result.data.length == 0) {
      kanji = "no data";
      furigana = "-";
      english = "-";
    } else {
      // kanji = result.data[0].japanese[0].word;
      kanji = "";

      console.log("japanese words: ");
      var words = [];
      result.data[0].japanese.forEach((word, i) => {
        word.word !== undefined ? words.push(word.word) : null;

        // console.log(
        //   `reading ${i}: ${word.reading} - - - (kanji: ${word.word})`
        // );
      });
      kanji = words.join("/");

      furigana = result.data[0].japanese[0].reading;

      if (kanji == undefined || kanji == "") {
        console.log("kanji reassigned because undefined or blank string...");
        kanji = furigana;
      }
      english = result.data[0].senses[0].english_definitions[0];

      console.log("  ");

      var englishWords = [];
      result.data[0].senses.forEach((sense, i) => {
        // console.log(`sense for ${i}: ${sense}`);
        // console.log(sense);
        sense.english_definitions.forEach((def, j) => {
          console.log(`sense ${i} - ${j} - ${def}`);
          if (def !== undefined && def !== "") {
            englishWords.push(def);
          }
        });

        console.log(" --- ");
      });

      // use two top english terms if more than one exists...
      if (englishWords[1] !== undefined) {
        english = [englishWords[0], englishWords[1]].join("/");
      }

      english = english.replace(/,/g, " -");
      english = english.replace(/\"/g, " -");
    }

    console.log(`entries found: ${result.data.length}`);
    console.log(`"${kanji},${furigana},${english}"`);

    console.log("˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅");

    return res.send(JSON.stringify(result.data, 0, 2));
  });
});

app.listen(4000, () => {
  console.log("notes server listening on port 4000");
});
