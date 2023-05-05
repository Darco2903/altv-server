import { Utils } from "alt-shared";

declare class Clock {
    protected hour: number;
    protected minute: number;
    protected speed: number;
    protected started: boolean;

    constructor(hour: number, minute: number): Clock;

    /**
     * Get if the clock is started.
     */
    public isStarted(): boolean;

    /**
     * Gets the current time data.
     */
    public getTimeData(): Utils.TimeData;

    /**
     * Get the time speed multiplier.
     */
    public getSpeed(): number;

    /**
     * Initializes the clock.
     * @param time The time data to initialize the clock with.
     */
    public init(time: Utils.TimeData): void;

    /**
     * Checks if the given time is valid.
     * @param hour The hour to check.
     * @param minute The minute to check.
     */
    protected _isValidTime(hour: number, minute: number): boolean;

    /**
     * Clock run loop.
     */
    protected _run(): void;

    /**
     * Starts the clock.
     */
    public start(): void;

    /**
     * Stops the clock.
     */
    public stop(): void;

    /**
     * Sets the current time.
     */
    public setTime(hour: number, minute: number): void;

    /**
     * Sets the clock speed.
     */
    public setSpeed(speed: number): void;
}
