import * as alt from "alt-server";

const commands = {};
const mutedPlayers = {};

/**
 * @typedef {Object} commandDataLight
 * @property {string} name
 * @property {string} description
 * @property {string[]} args
 * @property {number} permissionLevel
 */

/** @type {commandDataLight[]} */
let commandsLight = [];

alt.onClient("chat:message", async (player, msg) => {
    msg = msg.trim();
    if (msg.startsWith("/")) {
        msg = msg.substring(1);
        if (msg.length === 0) {
            return;
        }

        alt.log(`[command] ${player.name}: /${msg}`);
        const args = msg.split(" ").filter((arg) => arg.length > 0);
        const commandName = args.shift();
        /** @type {alt.Utils.Chat.commandData} */
        const command = commands[commandName];

        if (command) {
            if (!player.hasPermission(command.permissionLevel)) {
                player.notAuthorized();
                return;
            }

            try {
                await command.execute(player, args);
                alt.log(`~b~[command] ${player.name}: ~w~/${commandName} ${args.join(" ")}`);
            } catch (error) {
                alt.logError(`[command] ${player.name}: /${commandName} failed to execute: ${error}`);
                player.sendNotification({
                    imageName: "CHAR_BLOCKED",
                    headerMsg: "Erreur",
                    detailsMsg: `/${commandName}`,
                    message: "Une erreur est survenue lors de l'éxécution de la commande.",
                });
            }
        } else {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: `/${commandName}`,
                message: "Cette commande n'existe pas.",
            });
        }
    } else {
        if (mutedPlayers[player]) {
            send(player, "{FF0000} You are currently muted.");
            return;
        }

        if (msg.length > 0) {
            alt.log(`~b~[chat] ${player.name}: ~w~${msg}`);
            alt.emitAllClients("chat:message", player.name, msg.replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34"));
        }
    }
});

/**
 * @returns {commandDataLight[]}
 */
alt.on("resourceStart", () => {
    alt.setTimeout(() => {
        commandsLight = Object.values(commands).map((cmd) => {
            return {
                name: cmd.name,
                description: cmd.description,
                args: cmd.args,
                permissionLevel: cmd.permissionLevel,
            };
        });
    }, 100);
});

/**
 * @param {alt.Player} [player]
 */
function sendCommands(player) {
    alt.Utils.waitFor(() => commandsLight.length, 1000)
        .then(() => {
            // commandsLight.forEach((cmd) => {
            //     console.log(cmd.args);
            // });
            if (player) {
                alt.emitClient(player, "chat:commandsInit", commandsLight);
            } else {
                alt.emitAllClients("chat:commandsInit", commandsLight);
            }
        })
        .catch((err) => {
            alt.logError("[chat] commandsLight took too long:", err);
        });
}

alt.on("playerConnect", sendCommands);
alt.on("resourceStart", () => sendCommands());
alt.on("syncedMetaChange", (entity, key, value) => {
    if (entity === alt.Player.local && key === "op") {
        sendCommands();
    }
});

/**
 * @param {string} msg
 */
function broadcast(msg) {
    alt.emitAllClients("chat:message", null, msg);
}

/**
 * @param {alt.Player} player
 * @param {boolean} state
 */
function mutePlayer(player, state) {
    mutedPlayers[player] = state;
}

/**
 * @param {alt.Player} player
 * @param {string} msg
 * @param {string} [senderName]
 */
function send(player, msg, senderName = null) {
    alt.emitClient(player, "chat:message", senderName, msg);
}

/**
 * @param {Object} options
 * @param {string} options.name
 * @param {string[]} [options.args]
 * @param {string} [options.description]
 * @param {number} [options.permissionLevel]
 * @param {function(alt.Player, string[])} options.execute
 */
function registerCmd({ name, args = [], description = "", permissionLevel = 0, execute }) {
    if (!name || typeof execute != "function") {
        throw new Error("Invalid command name or execute function");
    }
    commands[name] = { name, args, description, permissionLevel, execute };
}

alt.Utils.Chat = {
    broadcast,
    mutePlayer,
    registerCmd,
    send,
};
