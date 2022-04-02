import fs from "fs";
import { parse } from "csv-parse";
import { tokenize } from "../src/spamengine/parsing";
import { glob } from "glob";

const globFiles = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

// Usage:
// From backend directory,
// run `yarn --silent script scripts/processCorpus.ts ../data/spam-yt/* | jq > ../data/spam.json`
(async () => {
  const patterns = process.argv.slice(2);

  const ngood: Record<string, number> = {};
  const nbad: Record<string, number> = {};
  const words: Record<string, number> = {};

  // 1. Count words
  for (const pattern of patterns) {
    const filenames = await globFiles(pattern);

    for (const filename of filenames) {
      console.warn("Processing", filename);

      const opts = { columns: true };

      const is = fs.createReadStream(filename);
      const csvReader = is.pipe(parse(opts));

      for await (const row of csvReader) {
        const { CONTENT: content, CLASS: classification } = row;
        const table = classification === "1" ? nbad : ngood;

        for (const token of tokenize(content)) {
          table[token] = (table[token] || 0) + 1;
          words[token] = 0;
        }
      }
    }
  }

  // 2. calculate word probabilities
  const probs: Record<string, number> = {};

  for (const word of Object.keys(words)) {
    let g = 2 * (ngood[word] || 0);
    let b = nbad[word] || 0;

    if (g + b >= 5) {
      const nbadLen = Object.keys(nbad).length;
      const ngoodLen = Object.keys(ngood).length;
      const fl =
        Math.min(1, b / nbadLen) /
        (Math.min(1, g / ngoodLen) + Math.min(1, b / nbadLen));

      const prob = Math.max(
        0.1,

        Math.min(0.99, fl)
      );

      probs[word] = prob;
    }
  }

  // 3. process new message
  const message =
    "This is by far the most well done and insightful beginner’s video I’ve seen. Your voice is soothing to listen to, and your energy is incredibly helpful and encouraging. Thank you for putting your soul into your work. 🙏🏼✨";
  const spam =
    "please like :D https://premium.easypromosapp.com/voteme/19924/616375350";
  const spam2 =
    "http://www.ebay.com/itm/171183229277?ssPageName=STRK:MESELX:IT&amp;_trksid=p3984.m1555.l2649";

  const naivebayes = (probabilities: number[]) => {
    const prod = probabilities.reduce((p, n) => p * n, 1);
    const minus = probabilities.reduce((p, n) => p * (1 - n), 1);
    return prod / (prod + minus);
  };

  const spamLikelihood = (
    message: string,
    probabilities: Record<string, number>
  ) => {
    const tokens = tokenize(message)
      .map((token): [string, number, number] => [
        token,
        Math.abs(0.5 - (probabilities[token] || 0.5)),
        probabilities[token] || 0.4,
      ])
      .sort((a, b) => b[1] - a[1]);

    const likelihood = naivebayes(tokens.slice(10).map((t) => t[2])); //probabilities[t[0]] || 0.4))

    console.log("Ranking:", tokens);
    console.log("Probability:", likelihood);
  };

  spamLikelihood(spam2, probs);

  // console.log(JSON.stringify(probs));
  // console.log(JSON.stringify({ nbad, ngood }));
  process.exit(0);
})();
