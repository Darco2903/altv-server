const fs = require("fs");

const pathToFile = process.argv[2];

if (!pathToFile) {
    console.log("No file specified");
    process.exit(1);
}

if (!fs.existsSync(pathToFile)) {
    console.log("File not found");
    process.exit(1);
}

(async () => {
    const file = await import("../" + pathToFile);
    const toJson = JSON.stringify(file, null, 4);
    fs.writeFileSync(pathToFile.replace(".js", ".json"), toJson);
})();
