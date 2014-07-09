Node Oauth2 client for xTuple Rest API
====


intro
----
Node client to work with (xTuple)[http://github.com/xtuple/xtuple] REST services.

After setting up Oauth in xTuple, setup  your local environment file

```shell
openssl pkcs12 -in keys/key.p12  -nocerts -nodes | openssl rsa -out keys/key.pem
#Enter Import Password: default 'notasecret'
cp sample.env .env
#open .env and fill in your environment variables and credentials
```
