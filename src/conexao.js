import mysql from 'mysql2';


const connection = mysql.createConnection({
  host: 'hopper.proxy.rlwy.net',
  port: 58989,
  user: 'root',
  password: 'cQOtrKRLbclAndfWVvFtbWOhfHieLElo',
  database: 'banco_animosidade'
});




export default connection;

