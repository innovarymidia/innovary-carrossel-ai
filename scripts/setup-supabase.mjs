import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const args = process.argv.slice(2);
  const tokenIndex = args.indexOf('--token');
  const projectIndex = args.indexOf('--project');

  const token = tokenIndex !== -1 ? args[tokenIndex + 1] : process.env.SUPABASE_ACCESS_TOKEN;
  const projectRef = projectIndex !== -1 ? args[projectIndex + 1] : process.env.SUPABASE_PROJECT_REF;

  const sqlPath = path.join(__dirname, '..', 'supabase_schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Arquivo supabase_schema.sql não encontrado em:', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  if (!token || !projectRef) {
    console.log(`
ℹ️ USO DO EXECUTOR VIA MANAGEMENT API DO SUPABASE:
node scripts/setup-supabase.mjs --token <SEU_PERSONAL_ACCESS_TOKEN> --project <PROJECT_REF>

Ou defina as variáveis de ambiente:
SUPABASE_ACCESS_TOKEN=sbp_...
SUPABASE_PROJECT_REF=...

Onde encontrar:
1. Access Token: https://supabase.com/dashboard/account/tokens
2. Project Ref: O código na URL do seu projeto (ex: https://supabase.com/dashboard/project/xyzabcdefgh -> 'xyzabcdefgh')
`);
    process.exit(1);
  }

  console.log(`🚀 Executando supabase_schema.sql no projeto '${projectRef}' via Supabase Management API...`);

  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Erro ao executar SQL (HTTP ${res.status}):`, errText);
      process.exit(1);
    }

    const data = await res.json();
    console.log('✅ SQL executado com sucesso no Supabase!');
    console.log('Tabelas criadas/atualizadas: carousels, slides, system_settings.');
  } catch (error) {
    console.error('❌ Falha na requisição:', error.message);
    process.exit(1);
  }
}

run();
