# Sistema HelpDesk

Sistema completo de HelpDesk com frontend em **React + TypeScript + Vite** e backend em **Laravel**.

---

## Visão Geral

O Sistema HelpDesk permite o cadastro, acompanhamento e gerenciamento de chamados de suporte técnico. Usuários podem abrir chamados, acompanhar o status, responder e anexar arquivos. Administradores têm acesso a funcionalidades extras de gestão.

---

## Estrutura do Projeto

```
workspace2/
├── HelpDesk2/
│   └── HelpDesk/         # Frontend (React + Vite)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── store/
│       └── .env
│       └── README.md
└── sistema_helpdesk/
    └── sistema_helpdesk/ # Backend (Laravel)
        ├── app/
        │   ├── Models/
        │   ├── Enums/
        │   └── Http/Resources/
        ├── database/
        │   └── migrations/
        └── .env
```

---

## Principais Funcionalidades

- Cadastro e autenticação de usuários
- Abertura, listagem e filtro de chamados
- Respostas a chamados (com anexos)
- Gestão de usuários e chamados (admin)
- Controle de status e prioridade
- Upload de arquivos
- Notificações de sucesso/erro

---

## Fluxo de Comunicação entre Backend e Frontend

### 1. **Autenticação**
- O usuário faz login pelo frontend (`Login.tsx`), que envia os dados para o backend via API.
- O backend retorna um token e os dados do usuário, que são salvos no Redux/localStorage.

### 2. **Cadastro de Usuário**
- O admin acessa a tela de cadastro (`Cadastro.tsx`), preenche os dados e envia para o backend.
- O backend cria o usuário e retorna sucesso ou erro.

### 3. **Abertura de Chamado**
- O usuário preenche o formulário em `NovoChamado.tsx` e envia.
- O frontend chama `createChamado` (em `services/index.ts`), que faz uma requisição POST para o backend.
- O backend salva o chamado e retorna os dados do chamado criado.

### 4. **Listagem de Chamados**
- O frontend chama `getChamados` para buscar todos os chamados.
- O backend retorna um array de chamados, que são exibidos em `Chamados.tsx`.

### 5. **Detalhe do Chamado e Respostas**
- Ao acessar um chamado, o frontend chama `getChamado` e `getChamadoResponses`.
- O backend retorna os detalhes do chamado e as respostas.
- O usuário pode responder usando `FormularioResposta.tsx`, que envia a resposta (e anexos) para o backend.

### 6. **Edição e Exclusão**
- Admins podem editar ou excluir chamados e usuários, enviando requisições PUT/DELETE para o backend.

### 7. **Atualização em tempo real**
- Após ações como criar, editar ou excluir, o frontend atualiza o estado local (Redux/useState) e refaz a busca se necessário.

---

## Principais Componentes e Páginas

- **Login.tsx**: Tela de autenticação.
- **Dashboard.tsx**: Visão geral dos chamados e usuários (admin).
- **Chamados.tsx**: Listagem, filtro e ações sobre chamados.
- **NovoChamado.tsx**: Formulário para abrir chamados.
- **DetalheChamado.tsx**: Detalhes do chamado, respostas e anexos.
- **FormularioResposta.tsx**: Formulário para responder chamados.
- **Usuarios.tsx**: Gestão de usuários (admin).
- **Cadastro.tsx**: Cadastro de novos usuários (admin).
- **Perfil.tsx**: Visualização e edição do perfil do usuário.

---

## Como rodar o Frontend

1. **Acesse a pasta do frontend:**
   ```sh
   cd HelpDesk2/HelpDesk
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```
   ou
   ```sh
   yarn
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```
   ou
   ```sh
   yarn dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

---

## Como rodar o Backend (Laravel)

1. **Acesse a pasta do backend:**
   ```sh
   cd sistema_helpdesk/sistema_helpdesk
   ```

2. **Instale as dependências:**
   ```sh
   composer install
   ```

3. **Configure o arquivo `.env`** com as informações do banco de dados.

4. **Gere a chave da aplicação:**
   ```sh
   php artisan key:generate
   ```

5. **Rode as migrations para criar as tabelas:**
   ```sh
   php artisan migrate
   ```

6. **(Opcional) Popule o banco com dados fake:**
   ```sh
   php artisan db:seed
   ```

7. **Inicie o servidor:**
   ```sh
   php artisan serve
   ```
   O backend estará disponível em `http://localhost:8000`

---

## Observações

- O arquivo `.env` **não deve ser enviado para o repositório**.
- Certifique-se de que o backend está rodando antes de iniciar o frontend.
- Ajuste as URLs do frontend/backend conforme necessário.

---

## Contato

Dúvidas ou sugestões? Abra uma issue ou entre em contato com o responsável pelo projeto.
