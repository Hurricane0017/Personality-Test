import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cyuqxzepcojyqbqczfwu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dXF4emVwY29qeXFicWN6Znd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTUxOTgsImV4cCI6MjA2MTY3MTE5OH0.zngHY9z0GXPTr0ivw2g17qhbEthRRkMf7Nb1mZ1ZWL4'  
export const supabase = createClient(supabaseUrl, supabaseKey)
