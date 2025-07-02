# Sistema HelpDesk

Este projeto é composto por um frontend em **React + TypeScript + Vite** e um backend em **Laravel**.

---

## Pré-requisitos

- Node.js (recomendado: 18.x ou superior)
- npm ou yarn
- PHP (8.1 ou superior)
- Composer
- MySQL ou MariaDB

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
   (ou a porta exibida no terminal)

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

3. **Configure o arquivo `.env`:**
   - Copie `.env.example` para `.env`:
     ```sh
     cp .env.example .env
     ```
   - Edite o arquivo `.env` e configure o banco de dados e outras variáveis.

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

- Certifique-se de que o backend está rodando antes de iniciar o frontend.
- Ajuste as URLs do frontend/backend conforme necessário.
- O arquivo `.env` **não deve ser enviado para o repositório**.

---

## Contato

Dúvidas ou sugestões? Abra uma issue ou entre em contato com o responsável pelo projeto.
