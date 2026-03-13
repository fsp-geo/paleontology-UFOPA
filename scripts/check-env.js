console.log('--- DIAGNÓSTICO DE AMBIENTE ---');
console.log('Node Version:', process.version);
console.log('CWD:', process.cwd());
console.log('DATABASE_URL definida:', !!process.env.DATABASE_URL);
console.log('DIRECT_URL definida:', !!process.env.DIRECT_URL);
console.log('Variáveis que terminam em _URL:', Object.keys(process.env).filter(k => k.endsWith('_URL')));
console.log('Variáveis que começam com NEXT_PUBLIC_:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
console.log('--- FIM DO DIAGNÓSTICO ---');
