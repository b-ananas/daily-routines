# Contents
The goal of this document is to explain basic concepts regarding this app and walk you through app setup.

# Setup
There are two ways of running this application: locally and via docker. For development purpose local setup is more convinient, though it requires more work to get up and running. On the other hand, using docker is crucial for deploying to stg and production environments, and should not be neglected.

## Local
1. Make sure nodejs is installed. 
2. Execute npm install ot install all the dependencies
3. Create DB in PostgreSQL
4. Export proper variables in `.env` file. Use `.env.example` as an example
5. Execute `npx prisma migrate deploy`
6. Run app with `npm run start`




# Remarks
## Docker & migrations
Generation of migration files from inside docker is discouraged. It is way easier to do so locally. To do so on `dev` you have to change connection URI from .env and execute
```npx prisma migrate dev```
It shouldn't be that big of a deal in `stg` and `prod`, as migration files are already generated and only have to be executed.
In some cases though, applying migrations with `prisma migrate deploy` manually may be neccesary. 