#!/usr/bin/env bash

# Creates an .env from ENV variables (mainly for use with `react-native-config`)

ENV_WHITELIST="^NF_"
printf "Creating an '.env' file with the following whitelist: "%s"\n" $ENV_WHITELIST
env | egrep $ENV_WHITELIST > .env
printf "'.env' file created\n"
