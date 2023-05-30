import * as alt from "alt-server";

alt.on("serverStarted", () => {
    alt.log("Type ~y~/help~w~ to show the list of commands.");
});

alt.on("consoleCommand", (name, args) => {
    switch (name) {
        case "stop-server":
            alt.log("~y~Stopping server...");
            alt.stopServer();
            break;

        case "r":
            alt.log("~y~Restarting main resource...");
            alt.restartResource("main");
            break;

        case "clearvehall":
            alt.log("~y~Clearing all vehicles...");
            alt.Vehicle.clearAll();
            break;

        case "help":
        case "h":
        case "?":
            alt.log(
                "\n",
                "~g~Available commands:\n",
                "~y~- stop-server:     Stop the server\n",
                "- r:               Reload the main resource\n",
                "- clearveh:        Clear all non player vehicles\n",
                "- help:            Show this help message"
            );
            break;

        default:
            alt.log(`Command "${name}" does not exist.`);
            break;
    }
});
