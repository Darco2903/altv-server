#! /bin/bash

if [ "$USER" != "server" ]; then
    exit 0
fi

(cd resources &&  git pull)
./update.sh
npm i
sudo service mysql start
./altv-server
