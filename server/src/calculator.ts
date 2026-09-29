import { piToDecimals } from './pi.js';

export type PiState = {
  pi: string;
  decimals: number;
  updatedAt: string;
};

type Logger = {
  info: (msg: string) => void;
  error: (msg: string) => void;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: save the state to a file so a restart doesnt go back to "3"
export class PiCalculator {
  private current: PiState = { pi: '3', decimals: 0, updatedAt: new Date().toISOString() };
  private stopped = false;

  constructor(
    private maxDecimals: number,
    private delayMs: number,
    private compute: (decimals: number) => string = piToDecimals
  ) {}

  get state(): PiState {
    return { ...this.current };
  }

  stop() {
    this.stopped = true;
  }

  async start(log: Logger) {
    for (let d = 1; d <= this.maxDecimals && !this.stopped; d++) {
      try {
        this.current = { pi: this.compute(d), decimals: d, updatedAt: new Date().toISOString() };
      } catch (err) {
        log.error(`calculation failed at ${d} decimals: ${err}`);
        return;
      }
      await sleep(this.delayMs);
    }
    log.info(`calculator done at ${this.current.decimals} decimals`);
  }
}
