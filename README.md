<br id="topo">

<p align="center"> <img src="./Imagens_md/BANNER.png" /></p>

## :bookmark_tabs: Sobre o projeto

A partir da apresentação do pedido dado pela empresa Visiona, a solução apresentada pela empresa The Perry Devs consiste no desenvolvimento de aplicações web para mapeamento automático de cicatrizes de queimadas em imagens do sensor WFI a bordo dos satélites CBERS4, CBERS4A e Amazônia 1, permitindo o monitoramento de áreas afetadas por queimadas com maior eficiência e precisão na geração de dados críticos para gestores ambientais, pesquisadores e formuladores de políticas públicas.

## :computer: Como Executar o Projeto

### :inbox_tray: Clonando o Repositório

Para clonar o repositório do projeto em sua máquina local, siga os passos abaixo:

1. Abra o terminal (ou prompt de comando) da sua preferência.

2. Navegue até o diretório onde deseja salvar o projeto.

3. Execute o seguinte comando:

```bash
git clone https://github.com/ThePerryDev/Hyperion-project.git
```

### 📁 Estrutura Básica do Projeto

```bash
📦 HYPERION-PROJECT                              # ← Raiz do repositório
┣ 📂 backend                                     # ← Diretório do backend (FastAPI)
┃ ┣ 📂 alembic                                   # ← Migrations do banco de dados com Alembic
┃ ┣ 📂 app                                       # ← Aplicação principal FastAPI
┃ ┃ ┣ 📂 controllers                             # ← Lógica dos controladores (camada intermediária entre rotas e serviços)
┃ ┃ ┣ 📂 core                                    # ← Configurações centrais da aplicação (ex: settings, auth, startup)
┃ ┃ ┣ 📂 models                                  # ← Definição dos modelos ORM (SQLAlchemy)
┃ ┃ ┣ 📂 routes                                  # ← Definição das rotas da API
┃ ┃ ┣ 📂 schemas                                 # ← Validações e contratos de dados (Pydantic)
┃ ┃ ┣ 📂 services                                # ← Lógica de negócio da aplicação
┃ ┃ ┣ 📂 utils                                   # ← Funções auxiliares e utilitárias
┃ ┃ ┣ 📜 main.py                                 # ← Arquivo principal que inicia a aplicação FastAPI
┃ ┃ ┗ 📜 requirements.txt                        # ← Dependências do backend
┃ ┣ 📜 .env                                      # ← Variáveis de ambiente (ex: URL do banco de dados)
┃ ┣ 📜 .gitignore                                # ← Arquivos ignorados pelo Git no backend
┃ ┣ 📜 alembic.ini                               # ← Configuração do Alembic
┃ ┗ 📜 requirements.txt                          # ← (Duplicado — talvez unificar com o da pasta `app`)
┣ 📂 frontend                                    # ← Diretório do frontend (React + TypeScript)
┃ ┣ 📂 public                                    # ← Arquivos públicos servidos diretamente (HTML, favicon)
┃ ┃ ┣ 📜 favicon.ico                             # ← Ícone do navegador
┃ ┃ ┗ 📜 index.html                              # ← HTML base onde o React é montado
┃ ┣ 📂 src                                       # ← Código-fonte da aplicação React
┃ ┃ ┣ 📂 assets                                  # ← Imagens e arquivos estáticos utilizados na UI
┃ ┃ ┣ 📂 components                              # ← Componentes reutilizáveis da interface
┃ ┃ ┣ 📂 context                                 # ← Contextos globais (React Context API)
┃ ┃ ┣ 📂 hooks                                   # ← Hooks personalizados para lógica reutilizável
┃ ┃ ┣ 📂 pages                                   # ← Páginas da aplicação (normalmente vinculadas às rotas)
┃ ┃ ┣ 📂 routes                                  # ← Definição de rotas (React Router, etc)
┃ ┃ ┣ 📂 services                                # ← Serviços de integração com APIs
┃ ┃ ┣ 📂 types                                   # ← Tipagens TypeScript globais ou compartilhadas
┃ ┃ ┣ 📂 utils                                   # ← Funções auxiliares reutilizáveis
┃ ┃ ┣ 📜 App.tsx                                 # ← Componente raiz da aplicação React
┃ ┃ ┣ 📜 custom.d.ts                             # ← Arquivo de definições customizadas para o TypeScript
┃ ┃ ┣ 📜 index.tsx                               # ← Ponto de entrada da aplicação React (renderização do App)
┃ ┃ ┗ 📜 react-app-env.d.ts                      # ← Arquivo de ambientação para o React com TypeScript
┃ ┣ 📜 .gitignore                                # ← Arquivos ignorados pelo Git no frontend
┃ ┣ 📜 package-lock.json                         # ← Versões travadas das dependências (gerado pelo npm)
┃ ┣ 📜 package.json                              # ← Configuração do projeto React e dependências
┃ ┗ 📜 tsconfig.json                             # ← Configurações de compilação do TypeScript
┣ 📂 Imagens_md                                  # ← Imagens utilizadas na documentação Markdown do projeto
┗ 📜 README.md                                   # ← Documento principal com instruções e visão geral do projeto
```

→ [Voltar ao topo](#topo)