export default class Filter {
    /** @type {AudioContext} */
    #audioContext;

    /**
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        this.#audioContext = audioContext;
    }

    /**
     * @param {BiquadFilterType} type
     * @param {number} frequency
     * @param {number} Q
     * @param {number} gain
     * @returns {BiquadFilterNode}
     */
    createBiquadFilter(type, frequency, Q, gain) {
        if (!type) throw new Error("Invalid type");
        const filter = this.#audioContext.createBiquadFilter();
        filter.type = type;
        if (frequency) filter.frequency.value = frequency;
        if (Q) filter.Q.value = Q;
        if (gain) filter.gain.value = gain;
        return filter;
    }

    /**
     * @param {number} gain
     * @returns {GainNode}
     */
    createGain(gain) {
        if (gain === undefined) throw new Error("Invalid gain");
        const filter = this.#audioContext.createGain();
        filter.gain.value = gain;
        return filter;
    }

    // /**
    //  * @param {number} delayTime
    //  * @returns {DelayNode}
    //  */
    // createDelay(delayTime) {
    //     if (delayTime === undefined) throw new Error("Invalid delayTime");
    //     const filter = this.#audioContext.createDelay();
    //     filter.delayTime.value = delayTime;
    //     return filter;
    // }

    // createConvolver() {
    //     const filter = this.#audioContext.createConvolver();
    //     return filter;
    // }
}
