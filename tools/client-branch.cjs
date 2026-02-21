const fs = require("fs");
const path = require("path");

const CLIENT_PATH = require("./clientPath.json");
const CONFIG_PATH = path.join(CLIENT_PATH, "altv.toml");

const argv = process.argv.slice(2);
const branch = argv[0];

if (!branch) {
    console.log("No branch specified");
    process.exit(1);
}

switch (branch) {
    case "dev":
    case "rc":
    case "release":
        break;
    default:
        console.log("Invalid branch specified");
        console.log("Valid branches: dev, rc, release");
        process.exit(2);
}

const content = fs.readFileSync(CONFIG_PATH, "utf-8");

const lines = content.split("\n");
const branchLineIndex = lines.findIndex((line) => line.includes("branch"));
let branchLine = lines[branchLineIndex];
const currentBranch = branchLine.split("=")[1].split("'")[1];
branchLine = branchLine.replace(currentBranch, branch);
lines[branchLineIndex] = branchLine;
const newContent = lines.join("\n");

fs.writeFileSync(CONFIG_PATH, newContent);

console.log(`Changed client branch from ${currentBranch} to ${branch}`);
