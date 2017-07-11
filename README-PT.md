# Plugin de Lista de Controle de Acesso para VueJS 2

>Esse plugin tem como objetivo controlar acesso a rotas do vue-router e o layout do sistema de acordo com uma permissão registrada no Vuex.

### Dependências:
- VueJS versão 2
- vue-router

### Instalação

Nós temos duas maneiras de instalar o plugin, a primeira usando o `npm` e a segunda fazendo manualmente

#### Para instalar com o NPM

Use o seguinte comando para instalar como uma dependência:

    npm install vue-acl --save

#### Para instalção standalone

Copie o arquivo `src/es6.js` para seu diretório de plugins.

### Começando:


**[1]:** Importe e registe o plugin no VueJS, é necessário passar alguns parâmetros, o router do vue-router e uma permissão padrão para o sistema:

    import Router from '../routes/router'
    import Acl from 'vue-acl'
    Vue.use( Acl, { router: Router, init: 'any' } )


**[2]:** Adicione um metadado nas suas rotas dizendo qual permissão necessária para acessar a rota, use pipe (|) para separar mais de uma permissão, outro metadado usado é o `fail`, que indicará para qual rota redirecionar em caso de erro:

    [
      {
        path: '/',
        component: require('./components/Public.vue'),
        meta: {permission: 'admin|any', fail: '/error'}
      },
      {
        path: '/manager',
        component: require('./components/Manager.vue'),
        meta: {permission: 'admin', fail: '/error'}
      },
      {
        path: '/client',
        component: require('./components/Client.vue'),
        meta: {permission: 'any', fail: '/error'}
      },
      {
        path: '/error',
        component: require('./components/Error.vue'),
        meta: {permission: 'admin|any'}
      },
    ]



**[3]:** Nos componentes use o metodo global `$can()` para definir se determinada permissão é compatível com a atualmente ativa:

  	<router-link v-show='$can("any")' to='/client'>To client</router-link> |
  	<router-link v-show='$can("admin")' to='/manager'>To manager</router-link> |
  	<router-link v-show='$can("admin|any")' to='/'>To Public</router-link>

Esse método recebe como parâmetro uma string com as permissões que você quer checar, quando mais de uma use pipe (|) para separa-las, o retorno será um `bool` mostrando se você tem ou não a permissão certa.

Para trocar a permissão atual do sistema use o método global `$access()`, passando como parametro a nova permissão do sistema:

	 this.$access('admin')

Você pode definir múltiplas permissões ativos passando um array para o método:

	 this.$access(['admin', 'write'])

Ou usando o operador &:

	 this.$access('admin&write')

Para ver a permissão atual do sistema basta chamar o método `$access()` sem parâmetro.

### Contribuindo


Para ajudar no desenvolvimento e expansão desse plugin faça um FORK do repositório na sua conta do GitHub, quando realizar as modificações faça um PULL REQUEST, iremos analisar se houve uma melhoria com a modificaçao, se sim então elas estará presente aqui.

Caso prefira, escreva o código ES6 e transpile ele para ES5 usando o Babel.

Dependências do node precisam ser escritas em ES5, mas optei por escrever o plugin em ES6, usando então o Babel para converter o código:

https://babeljs.io/repl/

### Demo
Para instalar demonstração use:

    npm run demo:install

Para executar use:

    npm run demo