import * as alt from "alt-server";

const LOG_PREFIX = "~y~[Clock]~w~ ";

export default class Clock {
    /**
     * Creates an instance of Clock.
     * @param {number} hour
     * @param {number} minute
     * @returns {Clock}
     */
    constructor(hour, minute) {
        if (this._isValidTime(hour, minute)) {
            this._hour = hour;
            this._minute = minute;
            this._speed = 1;
            this._started = false;
        } else {
            throw new Error("Invalid Time");
        }
    }

    /**
     * Get if the clock is started
     * @returns {boolean}
     */
    isStarted() {
        return this._started;
    }

    /**
     * Get current time
     */
    getTimeData() {
        return { hour: this._hour, minute: this._minute, speed: this._speed, started: this._started };
    }

    /**
     * Get the time speed multiplier
     * @returns {number}
     */
    getSpeed() {
        return this._speed;
    }

    /**
     * Initialize the clock
     * @param {alt.Utils.TimeData} time
     */
    init({ hour, minute, speed, started }) {
        this._hour = hour;
        this._minute = minute;
        this._speed = speed;
        this._started = started;
        if (this._started) {
            this._run();
        }
        alt.log(LOG_PREFIX, `Clock Initialized: ${hour}:${minute} - ${speed}x - ${started ? "Started" : "Stopped"}`);
    }

    /**
     * Get if the time is valid
     * @param {number} hour
     * @param {number} minute
     * @returns {boolean} - true if time is valid
     */
    _isValidTime(hour, minute) {
        return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
    }

    /**
     * Run the clock
     */
    _run() {
        if (!this._started) return;
        this._minute += this._speed;
        if (this._minute >= 60) {
            this._hour += Math.floor(this._minute / 60);
            this._minute %= 60;
            if (this._hour >= 24) {
                this._hour %= 24;
            }
        }
        setTimeout(this._run.bind(this), 2000); //  default time: 2 real seconds = 1 game minute
    }

    /**
     * Start the clock
     */
    start() {
        if (this._started) return;
        this._started = true;
        this._run();
        alt.emitAllClients("time:run", true);
        alt.log(LOG_PREFIX, "Clock Started");
    }

    /**
     * Stop the clock
     */
    stop() {
        if (!this._started) return;
        this._started = false;
        alt.emitAllClients("time:run", false);
        alt.log(LOG_PREFIX, "Clock Stopped");
    }

    /**
     * Set current time
     * @param {number} hour
     * @param {number} minute
     */
    setTime(hour, minute) {
        if (!this._isValidTime({ h: hour, m: minute })) {
            this._hour = hour;
            this._minute = minute;
            alt.emitAllClients("time:setTime", this.getTimeData());
            alt.log(LOG_PREFIX, `Clock Time set to: ${hour}:${minute}`);
        } else {
            throw new Error("Invalid Time");
        }
    }

    /**
     * Set time speed multiplier
     * @param {number} speed - time speed multiplier
     */
    setSpeed(speed) {
        this._speed = speed;
        alt.emitAllClients("time:setSpeed", speed);
        alt.log(LOG_PREFIX, `Clock Speed set to: ${speed}`);
    }
}
