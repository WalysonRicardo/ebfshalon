# Inscrição — Jonas: Saia do Porão

Formulário de inscrição para o evento infantil da IB Shalom (29 de agosto),
mais um painel privado para a equipe exportar as inscrições em planilha.

## Estrutura do projeto

```
inscricao-jonas/
├── index.html        → formulário público (o link que você divulga)
├── admin.html         → painel da equipe (não divulgue publicamente)
├── api/
│   ├── submit.js       → recebe e salva cada inscrição
│   └── export.js        → devolve as inscrições, só com a senha certa
├── package.json
└── .env.example
```

`index.html` e `admin.html` **não se comunicam pelo storage do navegador** —
cada inscrição é enviada para a função `api/submit.js`, que grava num banco
de dados (Vercel KV). O painel `admin.html` chama `api/export.js`, que só
responde se receber a senha correta.

---

## Passo a passo para publicar na Vercel

### 1. Suba o projeto para o GitHub (recomendado)
Crie um repositório novo e envie esta pasta para ele. Se preferir, dá para
publicar direto pela CLI da Vercel sem GitHub (passo 2b).

### 2a. Importar pelo site da Vercel (mais fácil)
1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Clique em **Add New → Project** e selecione o repositório.
3. A Vercel detecta automaticamente que é um projeto simples com pasta `api/`
   — não precisa mudar nenhuma configuração de build.
4. Ainda **não clique em Deploy** — antes, siga o passo 3 para criar o banco
   de dados. (Se já publicou, sem problema, é só configurar depois e o
   próximo deploy já funciona.)

### 2b. Ou publicar pela linha de comando
```bash
npm install -g vercel
cd inscricao-jonas
vercel
```

### 3. Criar o banco de dados (Upstash Redis, via Marketplace)
As inscrições precisam de um lugar para ficar guardadas. A Vercel descontinuou
o antigo "Vercel KV" — hoje o caminho é instalar o **Upstash Redis** pelo
Marketplace (também tem plano gratuito):

1. No painel do seu projeto na Vercel, vá na aba **Storage**.
2. Clique em **Create Database** (ou **Browse Marketplace**, dependendo da
   versão do painel).
3. Procure por **Upstash** e escolha **Redis**.
4. Selecione o plano gratuito, dê um nome (ex: `inscricoes-jonas`) e clique
   em **Continue / Create**.
5. Na tela seguinte, conecte ao projeto: selecione **EBF Shalon** (ou o nome
   que você deu ao projeto) e confirme.
   → Isso cria automaticamente as variáveis `KV_REST_API_URL` e
   `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`,
   dependendo da versão) no seu projeto. O código já está preparado para ler
   qualquer uma dessas — você não precisa copiar nada manualmente.

### 4. Definir a senha da equipe
1. Ainda no painel do projeto, vá em **Settings → Environment Variables**.
2. Adicione uma variável:
   - Nome: `ADMIN_PASSWORD`
   - Valor: `ibshalonkids` (ou troque por outra senha, se preferir)
3. Salve.

### 5. Fazer o deploy
Se você importou pelo site, clique em **Deploy**. Se já tinha publicado
antes de configurar o banco/senha, vá em **Deployments** e clique em
**Redeploy** para que as novas variáveis entrem em vigor.

### 6. Testar
- Formulário público: `https://seu-projeto.vercel.app/`
- Painel da equipe: `https://seu-projeto.vercel.app/admin.html`
  (essa URL não fica linkada em nenhum lugar do site — só quem a
  souber consegue chegar até ela, e mesmo assim precisa da senha)

---

## Rodando localmente (opcional)

```bash
npm install
vercel dev
```
Isso sobe o site em `http://localhost:3000` com as funções de API
funcionando, desde que você tenha rodado `vercel link` e as variáveis
de ambiente estejam configuradas no projeto da Vercel (o `vercel dev`
baixa elas automaticamente).

---

## Trocar a senha da equipe depois
Basta editar a variável `ADMIN_PASSWORD` em
**Settings → Environment Variables** na Vercel e fazer um redeploy.
A senha nunca fica exposta no código — ela só existe no servidor.

## Trocar data/horário do evento
Edite o texto em `index.html` (chips "Quando / Abertura / Culto" no topo)
e a frase de confirmação logo abaixo, dentro do mesmo arquivo.
