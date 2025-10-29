-- Primero, asegurarse de que la columna user_id existe
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Crear un usuario por defecto para las tareas existentes si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'default_user') THEN
    INSERT INTO users (username, email, password_hash)
    VALUES ('default_user', 'default@example.com', 'no_password');
  END IF;
END $$;

-- Actualizar las tareas existentes que no tienen user_id
UPDATE tasks 
SET user_id = (SELECT id FROM users WHERE username = 'default_user')
WHERE user_id IS NULL;