import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const STORAGE_KEY = 'inscricoes:jonas';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const authHeader = req.headers.authorization || '';
  const providedPassword = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : '';

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD não configurada nas variáveis de ambiente da Vercel.');
    res.status(500).json({ error: 'Senha de administrador não configurada no servidor.' });
    return;
  }

  if (!providedPassword || providedPassword !== adminPassword) {
    res.status(401).json({ error: 'Senha incorreta.' });
    return;
  }

  try {
    const raw = await redis.lrange(STORAGE_KEY, 0, -1);
    const entries = (raw || []).map((item) => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch (e) {
          return null;
        }
      }
      return item;
    }).filter(Boolean);

    res.status(200).json({ entries });
  } catch (err) {
    console.error('Erro ao buscar inscrições:', err);
    res.status(500).json({ error: 'Erro ao buscar inscrições.' });
  }
}
