var database_url = 'postgres://qmyujbjznpwsxx:fca598c76f26b6c7796b6e8f2320b7e1fd67b02506e7e4e8a861bbe61766e47b@ec2-23-21-246-25.compute-1.amazonaws.com:5432/d1gd2sk2eshrkm';
const { Pool } = require('pg');

var pool = function(){
  return new Pool({
    connectionString: process.env.DATABASE_URL || database_url,
    ssl: true
  });
}

module.exports = function(){
  return pool;
}
