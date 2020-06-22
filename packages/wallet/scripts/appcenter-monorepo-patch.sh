# This bash script patches our monorepo to be able to work with App Center
# see https://github.com/microsoft/appcenter/issues/278

# install dependencies from the monorepo root
cd ../..
yarn
cd ./packages/wallet

# force AppCenter to use yarn by creating empty `yarn.lock`
touch ./yarn.lock
