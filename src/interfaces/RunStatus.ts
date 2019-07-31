export default interface RunStatus {
    runId: string;
    ovenId: string;
    equilibrationStartTime: number | null;
    setpointStartTime: number | null;
    finishTime: number | null;
}
