<p align="center">
  <img src="./assets/logo-bankme.png" alt="Logo Bankme" width="91" height="108">
</p>
<h1 align="center">
  Aprove-me
</h1>


# Bankme Api

## Preparando o Ambiente

1. **Instalar o Docker**: Certifique-se de que você tem o Docker e o Docker Compose instalados na sua máquina. [Instruções de instalação do Docker](https://docs.docker.com/get-docker/)

2. **Clonar o Repositório**: Clone o repositório do projeto na branch correta para a sua máquina local.

    ```bash
    git clone -b pedro-henrique-a-silva-bankme-2024 git@github.com:pedro-henrique-a-silva/aprove-me.git

    cd aprove-me
    ```

## Iniciando o Projeto

O projeto ira rodar em containers do Docker todas as dependencias serão instaladas ao rodar o comando para iniciar os containers.

> Atenção: Dentro da pasta do backend e do frontend existem arquivos `example.env`, é necessário criar um arquivo `.env` na raiz de cada projeto com as variáveis necessarias para rodar a aplicação, siga o modelo do `.env.exemplo`

## Rodando o Projeto


1. **Iniciar o Contêiner**: Inicie o contêiner com o comando:

    ```bash
    docker-compose up -d --build
    ```

    Isso vai iniciar a aplicação da api que irá rodar na porta 3001 `http://localhost:3001`.

    E vai iniciar a aplicação frontend na porta 3000 `http://localhost:3000`

    Esse comando também incia um container rodando um banco o servidor do rabbitMQ, um container rodando o RabbitMQ para gerenciar as filas de processamento e um rodando um micro-serviço para consumir as filas para processamento.

2. **Acessar o Contêiner**:

Caso queira visualizar os logs dos containers basta utilizar:
 
  Para a api:

  ```bash
    docker logs -f bankme_api
  ```

  Para o frontend: 

  ```bash
    docker logs -f bankme_web
  ```

## Executando os testes

Na pasta raiz do projeto basta executar o comando `npm run test:back` para executar os testes do backend. Ou você pode entrar na pasta do backend e executar o comando `npm run test`

## Aplicação Frontend

Para acessar a aplicação frontend use o endpoint `http://localhost:3000`, já existe um login cadastrado através do processo de seeding.

Para fazer login na aplicação utilize: 

```
username: aproveme
password: aproveme
```

## Desenvolvimento

A api backend foi desenvolvida utilizando o Framework nestjs, utilizando Prisma e sqlite para o banco de dados.
foi feita uma integração com um serviço de email gratuito chamado **resend** que pode ser utilizado para os testes.
Mais desde que tenha as credenciais SMTP, e possivel utilizar qualquer outro serviço

A aplicação frontend foi desenvolvida utilizando Nextjs como tecnologia principal e tailwind para estilização dos componentes

## Deploy

Existe uma action do github configurada para esse repositório, ela pode ser utiliza como exemplo para que você construa seu proprio pipeline de deploy. Nesse pipeline é utilizado a Amazon Ec2 e docker para fazer o deploy

## Utilização

Acessando a url `http://localhost:3001/documentation` você terá uma documentação completa sobre todos os caminhos da API e como utiliza-los. 