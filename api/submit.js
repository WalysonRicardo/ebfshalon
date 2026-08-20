import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const STORAGE_KEY = 'inscricoes:jonas';
const MAX_LEN = 200;
const MAX_LEN_LONG = 500;

function clean(value, maxLen) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, maxLen);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  try {
    const body = req.body || {};

    const responsavel = clean(body.responsavel, MAX_LEN);
    const crianca = clean(body.crianca, MAX_LEN);
    const idade = clean(body.idade, 10);

    if (!responsavel || !crianca || !idade) {
      res.status(400).json({ error: 'Preencha nome do responsável, nome da criança e idade.' });
      return;
    }

    const entry = {
      responsavel,
      crianca,
      idade,
      restricao: body.restricao === 'sim' ? 'sim' : 'nao',
      restricao_detalhe: clean(body.restricao_detalhe, MAX_LEN_LONG),
      especial: body.especial === 'sim' ? 'sim' : 'nao',
      especial_detalhe: clean(body.especial_detalhe, MAX_LEN_LONG),
      igreja: body.igreja === 'visitante' ? 'visitante' : 'membro',
      criadoEm: new Date().toISOString(),
    };

    await redis.rpush(STORAGE_KEY, JSON.stringify(entry));

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar inscrição:', err);
    res.status(500).json({ error: 'Erro ao salvar inscrição. Tente novamente.' });
  }
}
