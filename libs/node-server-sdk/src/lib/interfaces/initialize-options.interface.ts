import { EnrollaError } from '../errors';

export interface InitializeOptions {
  apiToken: string;
  privateKey?: string;
  url?: string;
  polling?: {
    enabled: boolean;
    intervalSeconds: number;
    onError?: (error: EnrollaError) => void;
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
