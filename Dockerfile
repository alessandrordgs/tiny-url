# Usaremos a imagem oficial do Node 20
FROM node:20

# Cria o diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas arquivos de dependência para otimizar cache de build
COPY yarn.lock package.json ./

# Instala as dependências
RUN yarn install
# Copia todo o restante do código
COPY . .

# RUN yarn run migration:run
# Expõe a porta 3000 (ou a que seu app utilizar)
EXPOSE 3000

RUN yarn test
# Define o comando para iniciar a aplicação
CMD yarn migration:run && yarn start --host 0.0.0.0
