# ⚙️ Backend - API de Gestão de Financeira

Esta é a API responsável pela lógica de negócios e persistência de dados do sistema. Construída com **C#**, **.NET** e banco de dados **SQLite**.

## 🛠️ Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
* `.NET SDK 9.0+`
* Recomendado: `Insomnia/Postman`

## 🚀 Como Executar
1. Com o repositório clonado, navegue até a pasta do backend:
```bash
cd BackEnd
```
2. Baixe as dependências:
```bash
dotnet restore
```

3. Inicalize a API:
```bash
dotnet run
```

A API estará disponível em `http://localhost:8080`.

## 🔐 Autenticação (JWT)

Esta API é protegida por **JSON Web Tokens (JWT)**. 

> **⚠️ IMPORTANTE:** Com exceção das rotas de cadastro (`POST /user`) e autenticação (`POST /login`), **todas as outras rotas da aplicação exigem autenticação.**

### 🧪 Credenciais de Teste (Banco Populado)
Para facilitar os seus testes, o arquivo do banco de dados SQLite já está incluso no repositório com dados pré-cadastrados. Você pode usar as credenciais abaixo na rota `POST /login` para gerar um token imediatamente, sem precisar criar uma conta do zero:

| Perfil            | Email             | Senha      |
|-------------------|-------------------|------------|
| **Administrador** | admin@email.com   | admin123   |
| **Cliente Padrão**| cliente@email.com | cliente123 |

### Como acessar as rotas protegidas:
1. Crie um novo usuário na rota `POST /user`.
2. Faça o login na rota `POST /login` com as credenciais criadas. O corpo da resposta retornará um token.
3. Copie este token.
4. Caso esteja usando ferramentas como Postman ou Insomnia, envie o token no cabeçalho da requisição como `Bearer Token`.

---

## 📚 Endpoints Principais da API

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/user` | Cadastra um novo usuário | ❌ Livre |
| `POST` | `/login` | Autentica o usuário e retorna o JWT | ❌ Livre |
| `GET` | `/api/produtos` | Lista todos os produtos | 🔒 Bearer Token |
| `POST` | `/api/produtos` | Cadastra um novo produto | 🔒 Bearer Token |