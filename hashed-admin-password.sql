-- Admin-Benutzer mit vorgehashtem Passwort erstellen
-- Hash für 'admin123'
INSERT INTO users (username, password) 
VALUES ('admin', '5dca0265a572437dbe970273df31de8a7a83751c228497f936403c362d57c23b2c6e5c98ed615526d9fab53db36f536136b9c7e912f4718164063b86143a1fc7.c7c3d37946b32c3d78ed7072385688bc')
ON CONFLICT (username) DO NOTHING; 