const http = require('http');

let mariadb;
try {
  mariadb = require('mariadb');
} catch (e) {
  console.warn('mariadb package not installed. Using static message.');
}

async function getMessage() {
  if (!mariadb) {
    return 'Hola Mundo';
  }
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test'
    });
    const rows = await conn.query('SELECT "Hola Mundo" AS msg');
    return rows[0].msg;
  } catch (err) {
    console.error('Database error:', err.message);
    return 'Hola Mundo';
  } finally {
    if (conn) await conn.end();
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/hello') {
    const message = await getMessage();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
