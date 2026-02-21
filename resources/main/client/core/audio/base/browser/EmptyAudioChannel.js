export default class EmptyAudioChannel {
    position;
    filters;
    set filters(value) {}

    constructor() {
        this.position = {
            set: () => {},
        };
        this.filters = {
            push: () => {},
        };
    }

    setBuffer() {}
    setVolume() {}
    setRefDistance() {}
    play() {}
    pause() {}
    stop() {}
    setDistanceModel() {}
    setRolloffFactor() {}
}
