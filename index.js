const express = require("express");
const cors = require("cors");

const jishoApi = require("unofficial-jisho-api");
const jisho = new jishoApi();

const app = express();

app.use(cors());

app.get("/search", (req, res) => {
  console.log("req.query.term");
  console.log(req.query.term);
  const searchTerm = req.query.term;

  jisho.searchForPhrase(searchTerm).then((result) => {
    let kanji, furigana, english;

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
      words = [];
      result.data[0].japanese.forEach((word, i) => {
        word.word !== undefined ? words.push(word.word) : null;

        console.log(
          `reading ${i}: ${word.reading} - - - (kanji: ${word.word})`
        );
      });
      kanji = words.join("/");

      furigana = result.data[0].japanese[0].reading;

      if (kanji == undefined || kanji == "") {
        console.log("kanji reassigned because undefined or blank string...");
        kanji = furigana;
      }
      english = result.data[0].senses[0].english_definitions[0];
      english = english.replace(/,/g, " -");
      english = english.replace(/\"/g, " -");

      console.log("  ");
      result.data[0].senses.forEach((sense, i) => {
        // console.log(`sense for ${i}: ${sense}`);
        // console.log(sense);
        sense.english_definitions.forEach((def, j) => {
          console.log(`sense ${i} - ${j} - ${def}`);
        });
        console.log(" --- ");
      });
      // result.data[0].senses[0].english_definitions.forEach((def, i) => {
      //   console.log(`${i} - ${def}`);
      // });
    }

    console.log(`entries found: ${result.data.length}`);
    console.log(`"${kanji},${furigana},${english}"`);

    console.log("˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅˅");

    return res.send(`"${kanji},${furigana},${english}"`);
  });
});

app.listen(4000, () => {
  console.log("notes server listening on port 4000");
});
