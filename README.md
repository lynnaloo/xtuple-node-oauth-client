Node Oauth2 client for xTuple Rest API
====

Node client to work with [xTuple REST services.](http://github.com/xtuple/xtuple)

Before you can use this client with xTuple's OAuth 2.0 Server, you need to install the OAuth 2.0 extension in your xTuple application and create a reference for a new OAuth 2.0 Client. Be sure to select a "Client Type" of "Service Account". This will generate a private key and give you all the other information that you wll need to connect to the xTuple REST API.

Convert your key.p12 file to key.pem and copy it to the `keys` folder:

`openssl pkcs12 -in keys/key.p12  -nocerts -nodes | openssl rsa -out keys/key.pem`

Enter Import Password: 'notasecret'

Setup your environment variables:

`cp sample.env .env`

Open the .env file and change the information to match what was provided by the xTuple OAuth 2.0 extension.

