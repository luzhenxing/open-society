'use strict';

define(function () {
  return 'Bearer ' + $.cookie('X-Authorization');
  // return `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzAwMDAwMDAwMCIsImp0aSI6Ijg2NDcyODI2NTk3Mzg2NjQ5NiIsInNjb3BlcyI6WyIvOkdFVCJdLCJpc3MiOiJodHRwOi8vb3N3b3JkLmNvbSIsImlhdCI6MTQ5NTY5NTYyNSwiZXhwIjoxNDk1NzAyODI1fQ.8pRh0HbAKIDsKSIeirSn6PgT0VzFNPXEnL7KAr53JYE5Tyk4VInO4ni-WHrdQVwBA35I923VQjryGuW8yqbW9Q`
});