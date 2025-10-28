/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key) - Unique identifier for each task
      - `title` (text, required) - Task title
      - `description` (text, optional) - Task description
      - `status` (text, default 'pendiente') - Task status (pendiente/completada)
      - `created_at` (timestamptz) - Timestamp when task was created
      - `updated_at` (timestamptz) - Timestamp when task was last updated

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for public access (since no auth is required for this demo)
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) > 0),
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completada')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow public access for demo purposes
CREATE POLICY "Allow public read access"
  ON tasks FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON tasks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON tasks FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON tasks FOR DELETE
  TO anon
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();