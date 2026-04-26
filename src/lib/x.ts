import crypto from 'node:crypto';

const X_TWEETS_ENDPOINT = 'https://api.x.com/2/tweets';

interface XCredentials {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

function getCredentials(): XCredentials {
  const consumerKey = process.env.X_CONSUMER_KEY;
  const consumerSecret = process.env.X_CONSUMER_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    throw new Error('X credentials missing in environment');
  }
  return { consumerKey, consumerSecret, accessToken, accessTokenSecret };
}

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!*'()]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function buildAuthHeader(method: string, url: string, creds: XCredentials): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: '1.0',
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join('&');

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join('&');

  const signingKey = `${percentEncode(creds.consumerSecret)}&${percentEncode(
    creds.accessTokenSecret,
  )}`;

  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');

  const authParams: Record<string, string> = {
    ...oauthParams,
    oauth_signature: signature,
  };

  return (
    'OAuth ' +
    Object.keys(authParams)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(authParams[k])}"`)
      .join(', ')
  );
}

export interface PostTweetResult {
  id: string;
  text: string;
}

export async function postTweet(text: string): Promise<PostTweetResult> {
  const creds = getCredentials();
  const auth = buildAuthHeader('POST', X_TWEETS_ENDPOINT, creds);

  const res = await fetch(X_TWEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`X API ${res.status}: ${body}`);
  }

  const json = (await res.json()) as { data?: { id: string; text: string } };
  if (!json.data?.id) {
    throw new Error(`X API returned unexpected response: ${JSON.stringify(json)}`);
  }
  return json.data;
}

const TWEET_MAX = 280;
const URL_LENGTH = 23;

export function buildTweetText(title: string, articleUrl: string): string {
  const suffix = `\n\n${articleUrl}`;
  const suffixWeight = 2 + URL_LENGTH;
  const titleBudget = TWEET_MAX - suffixWeight;

  if (title.length <= titleBudget) {
    return `${title}${suffix}`;
  }

  const truncated = title.slice(0, titleBudget - 1).trimEnd() + '…';
  return `${truncated}${suffix}`;
}
