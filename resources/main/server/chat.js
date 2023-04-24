import * as alt from "alt-server";
import("./commands/index.js");

const commands = new Map();
let mutedPlayers = new Map();

/**
 * @param {Object} options
 * @param {string} options.name
 * @param {string[]} [options.args]
 * @param {string} [options.description]
 * @param {function(alt.Player, string[])} options.execute
 */
export function register({ name, args, description, execute }) {
    if (!name || typeof execute != "function") {
        throw new Error("Invalid command name or execute function");
    }
    commands.set(name, { name, args, description, execute });
}

alt.onClient("chat:message", (player, /** @type{ string }*/ msg) => {
    msg = msg.trim();
    if (msg.startsWith("/")) {
        msg = msg.substring(1);
        if (msg.length === 0) {
            return;
        }

        alt.log(`[command] ${player.name}: /${msg}`);
        const args = msg.split(" ");
        const commandName = args.shift();

        if (commands.has(commandName)) {
            const command = commands.get(commandName);

            try {
                command.execute(player, args);
            } catch (error) {
                alt.logError(`[command] ${player.name}: /${commandName} failed to execute: ${error}`);
                player.notify({
                    imageName: "CHAR_BLOCKED",
                    headerMsg: "Erreur",
                    detailsMsg: `/${commandName}`,
                    message: "Une erreur est survenue lors de l'éxécution de la commande.",
                });
            }
        } else {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: `/${commandName}`,
                message: "Cette commande n'existe pas.",
            });
        }
    } else {
        if (mutedPlayers.has(player) && mutedPlayers.get(player)) {
            send(player, "{FF0000} You are currently muted.");
            return;
        }

        if (msg.length > 0) {
            alt.log(`[chat] ${player.name}: ${msg}`);
            alt.emitAllClients("chat:message", player.name, msg.replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34"));
        }
    }
});

/**
 * @description Send a message to all players
 * @param {string} msg
 */
export function broadcast(msg) {
    alt.emitAllClients("chat:message", null, msg);
}

/**
 * @description Send a message to specified player
 * @param {alt.Player} player
 * @param {string} msg
 */
export function send(player, msg) {
    alt.emitClient(player, "chat:message", null, msg);
}

/**
 * @description Mute or unmute specific player
 * @param {alt.Player} player
 * @param {boolean} state
 */
export function mutePlayer(player, state) {
    mutedPlayers.set(player, state);
}
