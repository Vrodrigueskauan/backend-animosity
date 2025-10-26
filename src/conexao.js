import mysql from 'mysql2';


const connection = mysql.createConnection({
  host: 'ballast.proxy.rlwy.net',
  port: 16504,
  user: 'root',
  password: 'BJkdOLYUcWyoWscRnuBEgjjZwSnBSlHR',
  database: 'banco_animosidade'
});




export default connection;
