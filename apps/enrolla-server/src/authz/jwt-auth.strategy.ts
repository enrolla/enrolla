import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { initBaseAuth } from '@propelauth/node';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtAuth') {
  propelAuth = initBaseAuth({
    authUrl: process.env.PROPELAUTH_URL,
    apiKey: process.env.PROPELAUTH_API_KEY,
  });

  constructor(private tenantsService: TenantsService) {
    super();
  }

  async validate(payload: Request) {
    const jwt = payload.headers['authorization'];

    try {
      const { userId, orgIdToOrgMemberInfo: tenantId } =
        await this.propelAuth.validateAccessTokenAndGetUser(jwt);

      return { userId, tenantId, isSdk: false };
    } catch (error) {
      const { tenantId } = await this.tenantsService.validateApiToken(
        jwt.split(' ')[1]
      );

      return { userId: null, tenantId, isSdk: true };
    }
  }
}
