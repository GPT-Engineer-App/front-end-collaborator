import { supabase } from './supabase';

export const uploadFile = async (folder, file) => {
  const { data, error } = await supabase.storage
    .from(folder)
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) throw error;
  return data;
};

export const removeFile = async (folder, fileName) => {
  const { data, error } = await supabase.storage
    .from(folder)
    .remove([fileName]);

  if (error) throw error;
  return data;
};

export const listFiles = async (folder) => {
  const { data, error } = await supabase.storage
    .from(folder)
    .list();

  if (error) throw error;
  return data.map(file => file.name);
};

export const createCollection = async (collectionName) => {
  // Note: Supabase doesn't have a direct equivalent for creating collections.
  // This is a placeholder function. You might need to adjust based on your specific requirements.
  const { data, error } = await supabase
    .from('collections')
    .insert({ name: collectionName });

  if (error) throw error;
  return data;
};

export const listCollections = async () => {
  // Note: This is a placeholder. Adjust based on how you're storing collections in Supabase.
  const { data, error } = await supabase
    .from('collections')
    .select('name');

  if (error) throw error;
  return data.map(collection => collection.name);
};