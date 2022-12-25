import { Request } from 'express';

export function tenantIdFromRequest(request: Request): string {
  return request['user']['org_id'];
}
