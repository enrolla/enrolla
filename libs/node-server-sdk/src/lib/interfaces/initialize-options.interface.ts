import { FeatureValue } from '../interfaces';

export interface InitialzeOptions {
  apiToken: string;
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
      result: FeatureValue
    ) => void;
  };
}
