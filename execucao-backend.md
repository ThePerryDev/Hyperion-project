
<br id="topo">

<p align="center"> <img src="./Images_md/BANNER.png" /></p>

<span id="execucao">

## :computer: Como Executar o Projeto

### ⚙️ Backend

Para rodar o backend localmente, siga os passos abaixo. Certifique-se de ter o [Python](https://www.python.org/downloads/) e o [PostgreSQL](https://www.postgresql.org/download/) instalados na sua máquina.

> ⚠️ **Importante:** Por enquanto, é necessário criar manualmente o banco de dados no PostgreSQL antes de iniciar a aplicação.

### 📁 Estrutura Básica do Projeto

```bash
📦 HYPERION-PROJECT
┣ 📂 **backend**        # ← Diretório do backend
┃ ┣ 📂 alembic
┃ ┣ 📂 **app**          # ← Diretório principal da aplicação FastAPI
┃ ┃ ┣ 📂 controllers
┃ ┃ ┣ 📂 core
┃ ┃ ┣ 📂 models
┃ ┃ ┣ 📂 routes
┃ ┃ ┣ 📂 schemas
┃ ┃ ┣ 📂 services
┃ ┃ ┣ 📂 utils
┃ ┃ ┣ 📜 main.py
┃ ┃ ┗ 📜 requirements.txt
┃ ┣ 📜 alembic.ini
┃ ┗ 📜 .env
┣ 📂 venv
┣ 📜 .gitignore
┗ 📜 README.md
```

---

### 🚀 Passo a Passo para Execução

#### 1️⃣ Acesse a pasta `backend`:

```bash
cd backend
```

#### 2️⃣ Crie e ative o ambiente virtual:

```bash
py -m venv ../venv
../venv/Scripts/activate
```

#### 3️⃣ Instale as dependências (estando na pasta `backend`):

```bash
pip install -r app/requirements.txt
```

#### 4️⃣ Configure o banco de dados manualmente no PostgreSQL.

Crie um banco com o nome desejado, por exemplo: `hyperion`.

#### 5️⃣ Edite o arquivo `.env` com a URL de conexão:

```
DATABASE_URL=postgresql://USUARIO:SENHA@localhost:5432/hyperion
```

#### 6️⃣ Inicie o servidor FastAPI (estando na pasta `backend`):

```bash
uvicorn app.main:app --reload
```

A aplicação estará disponível em: [http://localhost:8000](http://localhost:8000)

→ [Voltar ao topo](#topo)
