import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  private _pubSub: PubSub;

  constructor() {
    this._pubSub = new PubSub();
  }

  public get pubSub() {
    return this._pubSub;
  }
}
