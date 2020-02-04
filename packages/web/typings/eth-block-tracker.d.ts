declare module "eth-block-tracker" {
  interface PollingBlockTrackerOptions {
    provider: any;
    pollingInterval?: number;
    retryTimeout?: number;
    keepEventLoopActive?: boolean;
    setSkipCacheFlag?: boolean;
  }

  class PollingBlockTracker {
    constructor(options: PollingBlockTrackerOptions);

    on(event: "latest", handler: (blockNumber: string) => void): void;
    on(event: "sync", handler: (data: { oldBlock: string | null; newBlock: string }) => void): void;
    on(event: "error", handler: (error: Error) => void): void;

    checkForLatestBlock(): string;

    getCurrentBlock(): string;

    getLatestBlock(): string;

    removeAllListeners(): void;

    isRunning(): boolean;
  }

  export = PollingBlockTracker;
}
