#! /bin/bash

if [ "$USER" != "server" ]; then
    exit 0
fi

git pull
npm update
./update.sh
sudo service mysql start
./altv-server