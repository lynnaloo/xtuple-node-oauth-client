
var fs = require("fs"),
  env = require('node-env-file'),
  googleapis = require("googleapis"),
  client, service, list, auth;

env(__dirname + '/.env');
var database = process.env.DATABASE,
  discoveryPath = process.env.DISCOVERY_HOST + database + "/discovery/v1alpha1/apis/v1alpha1/rest",

// params clientId, clientSecret, redirectUri, {authBaseUrl, tokenUrl}
oauth2 = new googleapis.OAuth2Client(
  process.env.CLIENTID,
  process.env.SECRET,
  process.env.REDIRECT_URI,
  {
    tokenUrl: process.env.TOKEN_CREDENTIAL_URI,
    authBaseUrl: process.env.DISCOVERY_HOST
  }
);

/**
 * The JWT authorization is ideal for performing server-to-server
 * communication without asking for user consent.
 *
 * Suggested reading for Admin SDK users using service accounts:
 * https://developers.google.com/admin-sdk/directory/v1/guides/delegation
 *
 * Note on the private_key.pem:
 * Node.js currently does not support direct access to the keys stored within
 * PKCS12 file (see issue comment
 * https://github.com/joyent/node/issues/4050#issuecomment-8816304)
 * so the private key must be extracted and converted to a passphrase-less
 * RSA key: openssl pkcs12 -in key.p12 -nodes -nocerts > key.pem
 */

jwt = new googleapis.auth.JWT(
  //email, keyFile, key, scopes, subject
  process.env.CLIENTID,
  process.env.PRIVATE_KEY_PATH,
  fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8"),
  // make sure this is an array
  [process.env.SCOPE],
  process.env.USERNAME,
  prcess.env.AUDIENCE,
  'localhost',
  'dev/oauth2/token',
  '8443',
  'assertion'
);

// Get discovery document
service = googleapis.discover('xtuple', 'v1alpha1', {
  baseDiscoveryUrl: discoveryPath,
  discoveryParams: { assertion_type: 'assertion' }
});

service.execute(function(err, data) {
  if (err) {
    console.log('Problem during the client discovery:', err);
    return;
  }

  jwt.authorize(function(err, result) {
    if (err) {
      console.log('Problem during the authorization:', err);
      return;
    }

    console.log(result);

    oauth2.setCredentials({
      access_token: result.access_token,
      refresh_token: result.refresh_token
    });

    list = data[database].contacts.list();
    list.withAuthClient(oauth2);
    list.execute(function(err, result) {});
  });
});
