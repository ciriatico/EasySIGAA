# Easysigaa

## Sobre
Easysigaa é um sistema que auxilia os alunos da Universidade de Brasília a realizar a matrícula em turmas durante o período de matrícula extraordinária.

## Funcionalidades 
 - Monitorar a quantidade de vagas em disciplinas.
 - Notificar por email o usuário em caso de mudanças.

## Requisitos
  - Node
  - Angular
  - MongoDB
  - Express.js
  - Python

## Instalação

1. Clone o projeto

> git clone https://github.com/ciriatico/easysigaa.git

2. Instale as dependências 

> 

3. Configure o Banco de dados

  - Crie uma conta no MongoDB;
  - Crie um banco de dados vazio;
  - Popule o banco com os dados das turmas (fastapi/data/data_db.csv);
  - Altera a string de conexão em backend/app.js para do seu banco de dados criado;

4. Configure o FastAPI

  > pip install "fastapi[all]"

5. Execute o projeto

> ng serve
> 
> node .\server.js -w
> 
> cd fastapi 
> 
> uvicorn main:app

A aplicação estará disponível em `http://localhost:4200/`.


