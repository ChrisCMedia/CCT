import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Funktion zum Hashen eines Passworts
async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

// Führe die Funktion aus
try {
  const hash = await hashPassword('admin123');
  console.log("Gehashtes Passwort für 'admin123':");
  console.log(hash);
} catch (err) {
  console.error("Fehler:", err);
} 