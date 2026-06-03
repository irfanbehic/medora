export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

type MockConfig = {
    failureRate: number;
  minDelayMs: number;
  maxDelayMs: number;
};

export const mockConfig: MockConfig = {
  failureRate: 0.04,
  minDelayMs: 120,
  maxDelayMs: 280,
};

export function setMockConfig(patch: Partial<MockConfig>): void {
  Object.assign(mockConfig, patch);
}

function randomDelay(): number {
  const { minDelayMs, maxDelayMs } = mockConfig;
  return minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
}

export function request<T>(
  resolver: () => T,
  options?: { forceSuccess?: boolean },
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (!options?.forceSuccess && Math.random() < mockConfig.failureRate) {
        reject(new NetworkError());
        return;
      }
      try {
        resolve(resolver());
      } catch (err) {
        reject(err);
      }
    }, randomDelay());
  });
}
