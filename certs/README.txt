Place your SSL private key and certificate in this folder.

For local development (self-signed):
  openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 \
    -subj "/C=IN/ST=YourState/L=YourCity/O=YourOrg/OU=Dev/CN=localhost"

Then run:
  cp .env.example .env
  # edit .env if your cert paths differ
  npm install
  npm run start