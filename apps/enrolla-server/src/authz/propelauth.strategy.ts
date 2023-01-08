import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { initBaseAuth } from '@propelauth/node';

@Injectable()
export class PropelAuthStrategy extends PassportStrategy(
  Strategy,
  'PropelAuth'
) {
  propelAuth = initBaseAuth({
    authUrl: process.env.PROPELAUTH_URL,
    apiKey: process.env.PROPELAUTH_API_KEY,
  });

  validate(payload: Request) {
    return this.propelAuth.validateAccessTokenAndGetUser(
      payload.headers['authorization']
    );
  }
}
