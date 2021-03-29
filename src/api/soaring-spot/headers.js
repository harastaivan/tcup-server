import crypto from 'crypto';
import config from '../../../config';

const { SOARING_SPOT_CLIENT_ID, SOARING_SPOT_SECRET } = config;

const nonce = 'abcdefghijklmnopqrstvwxyz';
const created = new Date().toISOString();

const signature = crypto
    .createHmac('sha256', SOARING_SPOT_SECRET)
    .update(nonce + created + SOARING_SPOT_CLIENT_ID)
    .digest('base64');

const authorization = `http://api.soaringspot.com/v1/hmac/v1 ClientID="${SOARING_SPOT_CLIENT_ID}", Signature="${signature}", Nonce="${nonce}", Created="${created}"`;

const headers = {
    Authorization: authorization
};

export default headers;
