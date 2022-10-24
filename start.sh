#! /bin/bash

if [ "$USER" != "server" ]; then
    exit 0
fi

(cd resources &&  git pull)
./update.sh
sudo service mysql start
./altv-server
