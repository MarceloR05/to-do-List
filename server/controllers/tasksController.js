const pool = require('../config/database');

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título es obligatorio'
      });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description?.trim() || '']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, completed } = req.body;

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede estar vacío'
      });
    }

    // Determine completed value: allow boolean `completed` or string `status`
    let completedValue;
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ success: false, message: 'completed debe ser booleano' });
      }
      completedValue = completed;
    } else if (status !== undefined) {
      if (!['pendiente', 'completada'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'El estado debe ser "pendiente" o "completada"'
        });
      }
      completedValue = status === 'completada';
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title.trim());
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description.trim());
      paramCount++;
    }
    if (completedValue !== undefined) {
      updateFields.push(`completed = $${paramCount}`);
      values.push(completedValue);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;

  // Log query for debugging when updating status/completed
  console.log('Executing query:', query);
  console.log('With values:', values);
  const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};
