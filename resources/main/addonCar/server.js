import alt from 'alt';


/*
alt.on('playerEnteredVehicle', (player, targetVehicle, seat) => {
  alt.emitClient(player, 'player:EnterVehicle')
});

alt.on('playerLeftVehicle', (player, targetVehicle, seat) => {
  alt.emitClient(player, 'player:LeftVehicle')
});



alt.onClient('vehicle:RPM', (player, rpm) => {
  console.log(rpm)
})

*/












////////////////        Speedometer





alt.on('playerEnteredVehicle', (player, vehicle, seat) => {
  alt.emitClient(player, 'playerEnterVehicle', vehicle, seat);
});

alt.on('playerLeftVehicle', (player, vehicle, seat) => {
  alt.emitClient(player, 'playerLeftVehicle', seat);
});

alt.on('playerChangedVehicleSeat', (player, vehicle, oldSeat, newSeat) => {
  alt.emitClient(player, 'playerChangedVehicleSeat', vehicle, newSeat);
});