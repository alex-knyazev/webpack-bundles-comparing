const spawn = require("cross-spawn");
const yargs = require("yargs");
const fs = require("fs");

const {
  argv: { ref1, ref2 },
} = yargs.options({
  ref1: {
    string: true,
    default: gitGetHeadHash(),
  },
  ref2: {
    string: true,
    default: `${gitGetHeadHash()}~`,
  },
});

run();

async function run() {
  gitCheckout(ref1);

  buildAndAnalyze();

  const currentBundleStatsPath = moveStatsFile(ref1);

  gitCheckout(ref2);

  buildAndAnalyze();

  const comparedBundleStatsPath = moveStatsFile(ref2);

  gitCheckout(ref1);

  compareBundles(currentBundleStatsPath, comparedBundleStatsPath);
}

function buildAndAnalyze(currentHash) {
  const buildResult = spawn.sync("npm", ["run", "build"]);

  console.log(buildResult.stdout);

  return buildResult;
}

function gitGetHeadHash() {
  const result = spawn.sync("git", ["rev-parse", "HEAD"]);

  console.log(result.stdout);

  return result.stdout.toString().trim();
}

function gitCheckout(to) {
  const result = spawn.sync("git", ["checkout", to]);

  console.log(result.stdout.toString());
}

function moveStatsFile(bundleName) {
  var oldPath = "./dist/stats.json";
  var newPath = `./stats-${bundleName}.json`;

  fs.copyFileSync(oldPath, newPath);

  return newPath;
}
function compareBundles(statsPath1, statsPath2) {
  const result = spawn.sync("npx", [
    "bundle-stats",
    "--html",
    "--json",
    statsPath1,
    statsPath2,
  ]);

  console.log(result.stdout.toString());
}
