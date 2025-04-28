import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yqxdynloqtqrknvaxrhx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxeGR5bmxvcXRxcmtudmF4cmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzYzMDQsImV4cCI6MjA2MDg1MjMwNH0.tB_JtYdsfRmB4UJqswhOvXkX7r_KdFnKAdt1INm0Bls'

export const supabase = createClient(supabaseUrl, supabaseKey) 