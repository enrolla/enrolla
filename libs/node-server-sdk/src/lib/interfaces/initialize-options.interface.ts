export interface InitialzeOptions {
  apiToken: string;
  url?: string;
  polling?: {
    enabled: boolean;
    intervalSeconds: number;
    onError?: (error: Error) => void;
  };
}
