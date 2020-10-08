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
    const kanji = result.data[0].japanese[0].word;
    const furigana = result.data[0].japanese[0].reading;
    const english = result.data[0].senses[0].english_definitions[0];

    console.log(`"${kanji},${furigana},${english}"`);

    return res.send(`"${kanji},${furigana},${english}"`);
  });
});

app.listen(4000, () => {
  console.log("notes server listening on port 4000");
});
