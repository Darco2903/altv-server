import * as alt from "alt-server";
import CommandManager from "./CommandManager.js";

// let cmdHandlers = {};
const commandManager = new CommandManager();
let mutedPlayers = new Map();

function invokeCmd(player, cmd, args) {
    cmd = cmd.toLowerCase();
    const callback = cmdHandlers[cmd];

    if (callback) {
        callback(player, args);
    } else {
        //  send(player, `{FF0000} Unknown command /${cmd}`);
        alt.emitClient(player, "notification", "command", `/${cmd} inconnu`);
    }
}

alt.onClient(
    "chat:message",
    /**
     * @param {alt.Player} player
     * @param {string} msg
     * @returns {void}
     */
    (player, msg) => {
        if (msg.startsWith("/")) {
            msg = msg.substring(1);
            if (msg.length === 0) {
                return;
            }
            alt.log(`[Command] ${player.name}: /${msg}`);
            const args = msg.split(" ");
            const command = args.shift();
            commandManager.get(command).execute(player, args);
        } else {
            if (mutedPlayers.has(player) && mutedPlayers[player]) {
                send(player, "{FF0000} You are currently muted.");
                return;
            }

            msg = msg.trim();

            if (msg.length > 0) {
                alt.log("[chat:msg] " + player.name + ": " + msg);

                alt.emitAllClients("chat:message", player.name, msg.replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34"));
            }
        }
    }
);

export function send(player, msg) {
    alt.emitClient(player, "chat:message", null, msg);
}

export function broadcast(msg) {
    send(null, msg);
}

// export function registerCmd(cmd, callback) {
//     cmd = cmd.toLowerCase();

//     if (cmdHandlers[cmd] !== undefined) alt.logWarning(`Command ${cmd} already registered, replacing now`);
//     //  alt.logError(`Failed to register command /${cmd}, already registered`);
//     cmdHandlers[cmd] = callback;
//     //}
// }

export function mutePlayer(player, state) {
    mutedPlayers.set(player, state);
}

// Used in an onConnect function to add functions to the player entity for a seperate resource.
export function setupPlayer(player) {
    player.sendMessage = (msg) => {
        send(player, msg);
    };

    player.mute = (state) => {
        mutePlayer(player, state);
    };
}

// Arbitrary events to call.
alt.on("sendChatMessage", (player, msg) => {
    alt.logWarning("Usage of chat events is deprecated use export functions instead");
    send(player, msg);
});

alt.on("broadcastMessage", (msg) => {
    alt.logWarning("Usage of chat events is deprecated use export functions instead");
    send(null, msg);
});
