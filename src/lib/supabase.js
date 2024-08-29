import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tomwaurajyktcauvdyvc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbXdhdXJhanlrdGNhdXZkeXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxNDQzMzQsImV4cCI6MjAzMjcyMDMzNH0.i1DGhf5zI6XmMefERJ8V9pmC_r9jMNd6l5VvYixgLDo'

export const supabase = createClient(supabaseUrl, supabaseKey)