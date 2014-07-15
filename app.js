var fs = require('fs'),
  dotenv = require('dotenv'),
  googleapis = require('googleapis-plus'),
  _ = require('underscore'),
  jwt,
  host,
  baseUrl,
  database;

// load environment variables
dotenv.load();

database = process.env.DATABASE;
host = 'https://' + process.env.HOST;
if (process.env.PORT) {
  host = host + ':' + process.env.PORT;
}
baseUrl = host + '/' + database;

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
  fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8'),
  // make sure this is an array
  [baseUrl + '/auth/' + database],
  process.env.USERNAME,
  baseUrl + '/oauth/token',
  process.env.HOST,
  '/' + database + '/oauth/token',
  process.env.PORT,
  'assertion'
);

// Don't specify a name because our discovery url doesn't include it
googleapis.discover('', 'v1alpha1',
  {baseDiscoveryUrl: baseUrl + '/discovery/v1alpha1/apis'}
).execute(function(err, client) {

  if (err) {
    console.log('Problem during the client discovery:', err);
    return;
  }

  jwt.authorize(function(err, result) {
    if (err) {
      console.log('Problem during the authorization:', err);
      return;
    }

    // *** Example REST Query ***
    // Now that we have the discovery doc, show a list of Contacts
    client[database].Contact.list()
    .withAuthClient(jwt)
    .execute(function(err, result) {
      if (result) {
        _.map(result.data.data, function(obj){
          console.log(obj.firstName, obj.lastName);
        });
      } else {
        console.log('No Contacts!');
      }
    });

  });
});
