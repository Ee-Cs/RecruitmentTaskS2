@echo off
set SPEC_DIR=cypress/e2e
set SPEC_1=%SPEC_DIR%/11_read_mission_and_rocket.cy.ts
set SPEC_2=%SPEC_DIR%/12_create_mission_and_rocket.cy.ts
set SPEC_3=%SPEC_DIR%/13_update_mission_and_rocket.cy.ts
set SPEC_4=%SPEC_DIR%/14_delete_mission_and_rocket.cy.ts
set SPEC_5=%SPEC_DIR%/21_transfer_rockets.cy.ts
set SPEC_6=%SPEC_DIR%/31_open_report.cy.ts
set SPECS=%SPEC_1%,%SPEC_2%,%SPEC_3%,%SPEC_4%,%SPEC_5%,%SPEC_6%

cd ..
set KEY=N
set /P KEY="Start HTTP server? Y [N]"
if /i "%KEY:~0,1%"=="Y" (
  cd dist\RecruitmentTaskS2\browser
  start "Recruitment Task S2" /MAX http-server . -p 8080
  cd ..\..\..
  pause
)
call npx cypress run --browser chrome --spec "%SPECS%"
pause
