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
  process.env.PORT
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

    // *** Example REST Queries ***

    // Show all To Do Items in a nice format
    client[database].ToDo.list({
      maxResults: 50,
      q: 'N'
    })
    .withAuthClient(jwt)
    .execute(function(err, result) {
      if (result) {
        console.log('Todos: ');
        _.map(result.data.data, function(obj){
          console.log(obj.uuid);
          console.log(obj.name);
          console.log(obj.description);
          console.log(obj.status);
        });
      } else {
        console.log('No Todos!');
      }
    });

    // Get a single To Do:
    // client[database].ToDo.get({uuid: 'e44d79ab-d9d8-40f2-af7d-0dc443b34269'})
    // .withAuthClient(jwt)
    // .execute(function(err, result) {
    //   if (result) {
    //     console.log('Todo: ');
    //     console.log(result);
    //   } else {
    //     console.log('No Todos!');
    //   }
    // });

    // Insert To Do
    // client[database].ToDo.insert({
    //   name: 'New To Do',
    //   dueDate: '08/09/2080',
    //   status: 'N',
    //   isActive: true,
    //   description: 'New To Do Entered by REST'
    // })
    // .withAuthClient(jwt)
    // .execute(function(err, result) {
    //   if (err) {
    //     console.log('Error:', err);
    //     return;
    //   }
    //   justAdded = result.data.id;
    //   console.log('Inserted:', result.data.id);
    // });

  });
});
