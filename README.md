xTuple OAuth2 Client for Node
====

Node client to work with [xTuple REST services.](http://github.com/xtuple/xtuple)

### Create new OAuth2 Client

Before you can use this client with xTuple's OAuth 2.0 Server, you need to install the OAuth 2.0 extension in your xTuple application and create a reference for a new OAuth 2.0 Client. Be sure to select a "Client Type" of "Service Account" and ensure that "Delegated Access" is checked. This will generate a private key and give you all the other information that you wll need to connect to the xTuple REST API.

### Test this OAuth2 API Client

Clone this repository and run `npm install`

or `npm install xtuple-node-oauth-client`

### Set your Private Key

Convert your key.p12 file to key.pem and copy it to the `keys` folder:

`openssl pkcs12 -in keys/key.p12  -nocerts -nodes | openssl rsa -out keys/key.pem`

Enter Import Password: 'notasecret'

### Setup Environment Variables

`cp sample.env .env`

Open the .env file and change the information to match what was provided by the xTuple OAuth 2.0 extension.

