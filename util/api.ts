import * as fs from "fs";
import { promisify } from "util";

const random = (contents: string) => {
  contents = contents.replace(/[\r]/g, "");
  const words = contents.split("\n");
  words.pop();
  const i = Math.floor(Math.random() * words.length);
  return words[i];
};

const getAllWordTypes = async () => {
  const wordTypes = await promisify(fs.readdir)("db");
  return wordTypes.map((w) => w.split(".")[0].slice(0, -1));
};

const contentsRetriever = async (filePath) => {
  const contents = await promisify(fs.readFile)(filePath);
  return random(contents.toString()) + " ";
};

const phraseGenerator = async (words) => {
  let phrase = "";
  const allWordTypes = await getAllWordTypes();
  for (const word of words) {
    if (word === "") continue;

    if (word !== "a" && allWordTypes.includes(word)) {
      const filePath = "db/" + word + "s.txt";
      phrase += await contentsRetriever(filePath);
    } else if (word !== "a") phrase += word + " ";
  }
  return phrase;
};

const vowelTester = (phrase) => new RegExp(/[aeiou]/gi).test(phrase[0]);

export const phraseResolver = async (words: string[]) => {
  let phrase = await phraseGenerator(words);
  if (words[0] == "a") phrase = (vowelTester(phrase) ? "an" : "a") + " " + phrase;
  phrase = phrase.slice(0, phrase.length - 1);
  return { phrase };
};
