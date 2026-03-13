const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const path = require('path');

// Manual .env loading since we don't have dotenv installed
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key.trim()] = value;
      }
    });
    console.log('✅ Arquivo .env carregado manualmente');
  } else {
    console.log('⚠️ Arquivo .env não encontrado');
  }
}

loadEnv();

async function checkConnections() {
  console.log('--- STATUS DAS CONEXÕES ---');

  // 1. Prisma / PostgreSQL
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    console.log('✅ Prisma/DB: Conectado (Users:', userCount, ')');
  } catch (e) {
    console.log('❌ Prisma/DB: Erro ao conectar -', e.message);
  } finally {
    await prisma.$disconnect();
  }

  // 2. Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Variáveis do Supabase (NEXT_PUBLIC_...) não encontradas');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Test query on User table (Prisma model name usually maps to table name)
    const { data, error } = await supabase.from('User').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase Auth/API: Conectado');
  } catch (e) {
    console.log('❌ Supabase Auth/API: Erro -', e.message);
  }

  // 3. Gemini API
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error('NEXT_PUBLIC_GEMINI_API_KEY não encontrada');
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "ping",
    });
    if (response.text) {
      console.log('✅ Gemini API: Conectado');
    }
  } catch (e) {
    console.log('❌ Gemini API: Erro -', e.message);
  }

  console.log('\n--- STATUS DAS KEYS (process.env) ---');
  const keysToCheck = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_GEMINI_API_KEY'
  ];

  keysToCheck.forEach(key => {
    const value = process.env[key];
    console.log(`${key}: ${value ? 'DEFINIDA (OK)' : 'AUSENTE (ERRO)'}`);
  });

  process.exit(0);
}

checkConnections();
