
var fs = require("fs"),
  env = require('node-env-file'),
  googleapis = require("googleapis-plus"),
  client,
  service,
  list,
  auth,
  host,
  baseUrl;

env(__dirname + '/.env');


host = "https://" + process.env.HOST;
if (process.env.PORT) {
  host = host + ":" + process.env.PORT;
}
baseUrl = host + "/" + process.env.DATABASE;

// params clientId, clientSecret, redirectUri, {authBaseUrl, tokenUrl}
oauth2 = new googleapis.OAuth2Client(
  process.env.CLIENTID,
  process.env.SECRET,
  baseUrl + "/oauth",
  {
    tokenUrl: baseUrl + "/oauth/token",
    authBaseUrl: baseUrl
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
  //email, keyFile, key, scopes, person, audience, host, path, port, grant
  process.env.CLIENTID,
  process.env.PRIVATE_KEY_PATH,
  fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8"),
  // make sure this is an array
  [baseUrl + "/auth/" + process.env.DATABASE],
  process.env.USERNAME,
  baseUrl + "/oauth/token",
  process.env.HOST,
  "/" + process.env.DATABASE + "/oauth/token",
  process.env.PORT,
  'assertion'
);

// Get discovery document
service = googleapis.discover('xtuple', 'v1alpha1', {
  baseDiscoveryUrl: baseUrl + "/discovery/v1alpha1/apis/v1alpha1/rest",
  discoveryParams: {}
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
