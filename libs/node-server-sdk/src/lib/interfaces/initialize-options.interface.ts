export interface InitialzeOptions {
  apiToken: string;
  privateKey?: string;
  url?: string;
  polling?: {
    enabled: boolean;
    intervalSeconds: number;
    onError?: (error: Error) => void;
  };
  evaluationHooks?: {
    beforeEvaluation?: (feature: string, organizationId: string) => void;
    afterEvaluation?: (
      feature: string,
      organizationId: string,
      result: any // eslint-disable-line @typescript-eslint/no-explicit-any
    ) => void;
  };
}
