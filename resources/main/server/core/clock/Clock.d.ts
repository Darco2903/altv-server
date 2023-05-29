type ClockTime = {
    hour: number;
    minute: number;
};

type ClockData = ClockTime & {
    speed: number;
    started: boolean;
};

export declare class Clock {
    // private #hour: number;
    public readonly hour: number;
    // private #minute: number;
    public readonly minute: number;
    // private #speed: number;
    /**
     * The speed of the clock.
     */
    public speed: number;
    private started: boolean;
    public readonly started: boolean;
    public timeData: ClockTime;

    public constructor(hour: number, minute: number): Clock;

    /**
     * Initializes the clock.
     */
    public init(clockData: ClockData): void;

    private #isValidTime(hour: number, minute: number): boolean;
    private #run(): void;

    /**
     * Starts the clock.
     */
    public start(): void;

    /**
     * Stops the clock.
     */
    public stop(): void;

    /**
     * Sets the time of the clock.
     */
    public setTime(hour: number, minute: number): void;
}
