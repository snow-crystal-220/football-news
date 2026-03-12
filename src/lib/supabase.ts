import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://lxzlqvfijioujvnnulqh.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA4YWIyNzRkLWQ3ZWYtNDg0Yy1iYjdlLTQ2NDExOTJmY2JiZSJ9.eyJwcm9qZWN0SWQiOiJseHpscXZmaWppb3Vqdm5udWxxaCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcyNDkxODE3LCJleHAiOjIwODc4NTE4MTcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.bY4rflbyHfKWQ3AUN5qiEUu0SVHM_Qrk2XQGNJko0cY';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };