@ECHO OFF
SET RestartTimer=0

:BEGIN
taskkill /F /im altv-server.exe
if errorlevel 1 GOTO :Start
GOTO:EXIT

:DBFirst
@echo Start DataBase first
TIMEOUT /T 5
GOTO :BEGIN

:Start
tasklist /fi "imagename eq httpd_z.exe" |find ":" > nul
if not errorlevel 1 GOTO:DBFirst
%CD%\altv-server.exe
TIMEOUT /T %RestartTimer%
GOTO:Start

:EXIT