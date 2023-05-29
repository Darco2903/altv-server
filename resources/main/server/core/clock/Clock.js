import * as alt from "alt-server";

const LOG_PREFIX = "~y~[Clock]~w~ ";

export default class Clock {
    /** @type {number} */
    #hour;
    /** @type {number} */
    #minute;
    /** @type {number} */
    #speed;
    /** @type {boolean} */
    #started;

    /**
     * Creates an instance of Clock.
     * @param {number} hour
     * @param {number} minute
     * @returns {Clock}
     */
    constructor(hour, minute) {
        if (!this.#isValidTime(hour, minute)) {
            throw new Error("Invalid Time");
        }
        this.#hour = hour;
        this.#minute = minute;
        this.#speed = 1;
        this.#started = false;
    }

    get hour() {
        return this.#hour;
    }

    get minute() {
        return this.#minute;
    }

    /**
     * Get if the clock is started
     * @returns {boolean}
     */
    get started() {
        return this.#started;
    }

    /**
     * Get current time
     */
    get timeData() {
        return {
            hour: this.#hour,
            minute: this.#minute,
            speed: this.#speed,
            started: this.#started,
        };
    }

    /**
     * Get the time speed multiplier
     * @returns {number}
     */
    get speed() {
        return this.#speed;
    }

    /**
     * Set time speed multiplier
     * @param {number} speed - time speed multiplier
     */
    set speed(speed) {
        console.log("SPEED CHANGED");
        this.#speed = speed;
        alt.emitAllClients("time:setSpeed", speed);
        alt.log(LOG_PREFIX, `Clock Speed set to: ${speed}`);
    }

    /**
     * Initialize the clock
     * @param {alt.Utils.Clock.TimeData} time
     */
    init({ hour, minute, speed, started }) {
        this.#hour = hour;
        this.#minute = minute;
        this.#speed = speed;
        this.#started = started;
        if (this.#started) {
            this.#run();
        }
        alt.log(LOG_PREFIX, `Clock Initialized: ${hour}:${minute} - ${speed}x - ${started ? "Started" : "Stopped"}`);
    }

    /**
     * Get if the time is valid
     * @param {number} hour
     * @param {number} minute
     * @returns {boolean} - true if time is valid
     */
    #isValidTime(hour, minute) {
        return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
    }

    /**
     * Run the clock
     */
    #run() {
        if (!this.#started) return;
        this.#minute += this.#speed;
        if (this.#minute >= 60) {
            this.#hour += Math.floor(this.#minute / 60);
            this.#minute %= 60;
            if (this.#hour >= 24) {
                this.#hour %= 24;
            }
        }
        setTimeout(this.#run.bind(this), 2000); //  default time: 2 real seconds = 1 game minute
    }

    /**
     * Start the clock
     */
    start() {
        if (this.#started) return;
        this.#started = true;
        this.#run();
        alt.emitAllClients("time:run", true);
        alt.log(LOG_PREFIX, "Clock Started");
    }

    /**
     * Stop the clock
     */
    stop() {
        if (!this.#started) return;
        this.#started = false;
        alt.emitAllClients("time:run", false);
        alt.log(LOG_PREFIX, "Clock Stopped");
    }

    /**
     * Set current time
     * @param {number} hour
     * @param {number} minute
     */
    setTime(hour, minute) {
        if (!this.#isValidTime({ h: hour, m: minute })) {
            this.#hour = hour;
            this.#minute = minute;
            alt.emitAllClients("time:setTime", this.timeData);
            alt.log(LOG_PREFIX, `Clock Time set to: ${hour}:${minute}`);
        } else {
            throw new Error("Invalid Time");
        }
    }
}
