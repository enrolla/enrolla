import * as api from '../api';

export const createCustomer = async (input: {
  name: string;
  organizationId?: string;
  createOrganizationName?: string;
}) => {
  return await api.createCustomer(input);
};
