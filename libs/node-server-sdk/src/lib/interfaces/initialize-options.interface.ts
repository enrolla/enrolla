import { EnrollaError } from '../errors';

/**
 * Options for initializing the Enrolla SDK.
 */
export interface InitializeOptions {
  /**
   * The API token for secure communication with the Enrolla Server. Required.
   */
  apiToken: string;

  /**
   * Your private key for encrypting and decrypting secrets. Optional, but is required for using all secret related functionality.
   */
  privateKey?: string;

  /**
   * Allows overriding the default Enrolla Server GraphQL endpoint. Optional.
   */
  url?: string;

  /**
   * Polling configuration. Optional. (if not supplied polling will be disabled, and the sdk will not update data during runntime)
   */
  polling?: {
    /**
     * Whether to enable polling. Required if `polling` configuration object is supplied.
     */
    enabled: boolean;

    /**
     * The polling interval in seconds.  Required if `polling`configuration object is supplied.
     */
    intervalSeconds: number;

    /**
     * Function to be called on polling error. Optional.
     * @param error - The error that occurred.
     */
    onError?: (error: EnrollaError) => void;
  };

  /**
   * Lifecycle hooks for feature evaluation. Optional.
   */
  evaluationHooks?: {
    /**
     * Lifecycle hook called before feature evaluation.
     * @param feature - Feature name.
     * @param organizationId - The organization ID for which the feature is being evaluated.
     */
    beforeEvaluation?: (feature: string, organizationId: string) => void;

    /**
     * Lifecycle hook called after feature evaluation.
     * @param feature - Feature name.
     * @param organizationId - The organization ID for which the feature is being evaluated.
     * @param result - The result of the evaluation.
     */
    afterEvaluation?: (
      feature: string,
      organizationId: string,
      result: any // eslint-disable-line @typescript-eslint/no-explicit-any
    ) => void;
  };

  /**
   * Function to be called on push error. Optional.
   * @param error
   */
  onPushError?: (error: EnrollaError) => void;
}
