const { Pool } = require("pg");


const pool = new Pool({
  user: "postgres",      
  host: "localhost",       
  database: "empresa",
  password: "246810",  
  port: 5432,             
});

module.exports = pool;
