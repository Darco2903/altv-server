@echo OFF
taskkill /F /im altv-server.exe
rmdir cache /s /q
rmdir crashdumps /s /q