#!/bin/bash

name="altv-server"
pid=$(pidof $name)

if [ ! -z $pid ]
then
	kill "$pid"
fi

./"$name"