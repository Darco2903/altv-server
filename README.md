# alt:V Server

## Description

This project is a private [**alt:V**](https://altv.mp) server, a GTA V multiplayer mod, designed for fun and experimentation with friends. It includes cool and experimental features such as custom vehicles, custom player models, custom game modes, and some cool stuff like realistic audio streaming.

It was initially put aside but has now been abandoned after alt:V stopped being maintained amid legal issues involving Rockstar Games. Although the server is no longer active, the code and features implemented can still be explored, enjoyed, or used as a reference for similar projects. This project may be ported to FiveM in the future to continue development and add new features, but for now, no further updates are planned.

Feel free to explore the code and see what cool features were implemented!

## Features

### Realistic audio streaming

An immersive synced sound system using [**Three.js**](https://threejs.org) positional audio that can be used for dynamic and realistic audio effects in the game. Some examples of this feature can be seen in the following videos:

- [Event Stage](https://youtu.be/asJ1e3hYx2k)
- [Car Audio](https://youtu.be/RmrGB9Zz9NE)
- [Sonic Boom](https://youtu.be/b2D1818d1jk)

### Chat & Commands

A chat system that allows players to communicate with each other and execute commands. The command system has static and dynamic auto-completion and supports various commands for gameplay features, such as spawning vehicles, kicking players, and teleporting.

### Custom Game Modes

#### Prop Hunt

Engage in a fun and competitive game mode where players can hide as props and others must find them. This game mode is still in development, but you can check out some early gameplay footage here:

- [Prop Hunt](https://youtu.be/Xz5a5jH2JmI)

#### Guess Who

A team-based game mode where one team (the hunters) must identify and eliminate the other team (the hiders) who are disguised as NPCs and have to blend in with the crowd.

---

### Vehicle Features

A variety of systems that enhance the driving experience and add realism to the game.

#### Forza Speedometer (edited from [fh4speed](https://github.com/kasuganosoras/fh4speed)):

A sleek and accurate speedometer inspired by Forza Horizon 4, providing real-time speed and RPM information while driving in the game.

- [Forza Speedometer](https://youtu.be/bl8b-1XHaWQ)

#### Flight Instruments (using [Artificial-Horizon](https://github.com/richtr/Artificial-Horizon)):

A set of instruments that provide information about the vehicle's altitude, speed, and orientation, similar to those found in aircraft.

- [Flight Instruments](https://youtu.be/fhaHP5X4Ri0)

#### Speed Regulator

A system that allows players to set a desired speed for their vehicle and the game will automatically calculate and adjust the throttle to maintain that speed. It can be turned on or off as needed, and the desired speed can be adjusted on the fly.

- [Speed Regulator](https://youtu.be/eojcJbZd_dY)

#### Manual Transmission

Allows players to manually shift gears in vehicles.

#### Traction Control (TC)

A system that helps prevent wheel spin and loss of traction by automatically adjusting the throttle to maintain optimal grip on the road. This can enhance the driving experience by providing better control and stability, especially in high-performance vehicles or during aggressive driving maneuvers. The traction control system can also help reduce tire wear by preventing excessive wheel spin, which can lead to faster degradation of the tires.

- [Traction Control](https://youtu.be/gpDyUSwileg)

#### Anti-lock Braking System (ABS)

A safety feature that prevents the wheels from locking up during hard braking. Actually, in the base game, wheels will not really lock up but the ABS will reduce the tire wear by modulating the brake pressure.

#### Electronic Stability Control (ESC)

A system that helps prevent skidding and loss of control. It is not fully implemented yet, but the dashboard will display a warning light when the system detects a potential loss of control. The idea is to automatically apply corrective measures, such as reducing engine power, steering assistance, or applying brakes, to help the player regain control of the vehicle.

#### Battery

A system that simulates the vehicle's battery, which can be drained by using certain electrical components (e.g., starter motor) and recharged by the alternator while the engine is running. If the battery is completely drained, the vehicle will not start.

#### Engine Temperature

A system that simulates the engine's temperature, which can increase due to factors such as high RPMs, heavy loads, or turbo boost. If the engine temperature gets too high, it can lead to overheating and potential damage to the vehicle. Radiator fans will automatically turn on to increase airflow to help cool down the engine when necessary. The current implementation is not perfect and is only a first step towards a more complex system that will include coolant levels, oil temperature and other factors that can affect the engine's performance.

#### Starter Motor

Manual starter motor that disable the automatic engine starting when entering a vehicle and needs to be held down to start the engine. The starting time is based on the vehicle type, the engine's health/temperature, and the battery's charge level. If the engine is in poor condition, cold, or the battery is too low, it will take longer to start the engine. If the fuel tank is empty, the battery is completely drained, or the engine is in very bad condition, the engine will not start at all.

#### Fuel System

A system that simulates the vehicle's fuel consumption based on engine load, throttle, and RPMs. Idling will consume a small amount of fuel, while aggressive driving will consume more fuel. If the fuel tank is empty, the engine will stall.

#### Tire Wear

Uses the default game wear system for tires. As tires wear down, they can lose grip and become more prone to punctures or blowouts. This feature displays the tire wear level on the dashboard and sync the tire wear state with other players so that everyone can see the same tire condition.

---

### Menus

#### Player Model Selector

Display a menu that allows players to change their character's model to any available in the game, including custom models added to the server.

#### Player Appearance Customization

Display a menu that allows players to customize their character's appearance, including options for clothing, accessories, and other cosmetic items.

#### Vehicle Spawner

Display a menu that allows players to spawn all available vehicles, including custom vehicles added to the server.

#### Vehicle Customization

Display a menu that allows players to customize their vehicles with all available modifications, including performance upgrades, visual modifications, and other enhancements.

#### Weapon Spawner

Display a menu that allows players to spawn all available weapons, including custom weapons added to the server.

#### Input Menu

Display a menu that allows players to view and customize their key bindings for non-default controls, such as the speed regulator, starter motor, respawn, noclip, and other custom features.
