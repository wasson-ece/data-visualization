export default class Detector {
    id: string;
    reading: number;
    pollRate: number;

    constructor(id: string, reading: number = NaN, pollRate: number = NaN) {
        this.id = id;
        this.reading = reading;
        this.pollRate = pollRate;
    }

    setReading = (reading: number) => (this.reading = reading);

    getReading = () => this.reading;
}
