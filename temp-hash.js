const crypto = require('crypto');

// Funktion zum Hashen eines Passworts
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, buf) => {
      if (err) reject(err);
      resolve(`${buf.toString('hex')}.${salt}`);
    });
  });
}

// Führe die Funktion aus
hashPassword('admin123').then(hash => {
  console.log("Gehashtes Passwort für 'admin123':");
  console.log(hash);
}).catch(err => {
  console.error("Fehler:", err);
}); 