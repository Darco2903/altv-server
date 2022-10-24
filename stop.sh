exec="altv-server"
pid=$(pidof $exec)

if [ ! -z "$pid" ]
then
    sudo kill "$pid"
	sudo service mysql stop
fi