import * as jwt from 'jsonwebtoken';
import { Context } from 'graphql-ws';

export const subscriptionsTransportWsOnConnect = ( { authToken }: { authToken?: string; } ) => {
    if(!authToken) {
        console.log('subscriptionsTransportWsOnConnect no token found');

        return { tenantId: '' };
    }

    try {
        const decoded = jwt.verify(authToken, process.env.API_TOKEN_GENERATION_PRIVATE_KEY);

        console.log('subscriptionsTransportWsOnConnect id = ' + decoded['tenantId']);

        return { tenantId: decoded['tenantId'] };
    } catch (error) {
        return '';
    }

};

export const graphqlWsOnConnect = (context: Context<any>) => {
    const { connectionParams, extra } = context;
    console.log('graphql-ws')
    // user validation will remain the same as in the example above
    // when using with graphql-ws, additional context value should be stored in the extra field
    console.log('connectionParams', connectionParams);
    console.log(connectionParams?.['Authorization']);

    // console.log('extra', extra);
    // console.log('extra', extra);

};

