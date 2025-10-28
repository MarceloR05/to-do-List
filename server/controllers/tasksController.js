import { supabase } from '../config/supabase.js';

export const getAllTasks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título es obligatorio'
      });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description?.trim() || ''
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede estar vacío'
      });
    }

    if (status && !['pendiente', 'completada'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'El estado debe ser "pendiente" o "completada"'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
