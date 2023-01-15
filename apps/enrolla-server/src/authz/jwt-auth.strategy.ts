import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { initBaseAuth } from '@propelauth/node';
import { ApiTokenService } from '../tenants/api-tokens/service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtAuth') {
  private propelAuth;

  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private apiTokenService: ApiTokenService) {
    super();

    if (!process.env.PROPELAUTH_URL) {
      this.logger.warn('PROPELAUTH_URL is not set, JWT validation is disabled');
      this.propelAuth = null;
    } else {
      this.propelAuth = initBaseAuth({
        authUrl: process.env.PROPELAUTH_URL,
        apiKey: process.env.PROPELAUTH_API_KEY,
      });
    }
  }

  async validate(payload: Request) {
    const jwt = payload.headers['authorization'];

    if (!this.propelAuth) {
      return {
        userId: '0',
        tenantId: '0',
        isSdk: false,
      };
    }

    try {
      // Trying to validate the JWT as a PropelAuth token by default, representing management ui access
      const { userId, orgIdToOrgMemberInfo } =
        await this.propelAuth.validateAccessTokenAndGetUser(jwt);

      return {
        userId,
        tenantId: Object.keys(orgIdToOrgMemberInfo)[0],
        isSdk: false,
      };
    } catch (error) {
      // If the JWT is not a PropelAuth token, we assume it's an API token, representing SDK access
      // In case of an error, the method will throw an exception and 401 unauthorized will be returned
      const { tenantId } = await this.apiTokenService.validate(
        jwt.split(' ')[1]
      );

      return { userId: null, tenantId, isSdk: true };
    }
  }
}
