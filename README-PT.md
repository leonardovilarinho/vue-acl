# Plugin de Lista de Controle de Acesso para VueJS 2

>Esse plugin tem como objetivo controlar acesso a rotas do vue-router e o layout do sistema de acordo com uma permissão registrada no Vuex.

### Dependências:
- VueJS versão 2
- vue-router
- Vuex versão 2

### Instalação

Nós temos duas maneiras de instalar o plugin, a primeira usando o `npm` e a segunda fazendo manualmente

#### Para instalar com o NPM

Use o seguinte comando para instalar como uma dependência:

    npm install vue-acl --save

#### Para instalção standalone

Copie o arquivo `src/Acl.js` para seu diretório de plugins.

### Começando:

**[1]:** Crie no state do Vuex uma variável chamada `acl_current`, ela definirá qual permissão está ativa atualmente no sistema:

    ...
  	state: {
  	  acl_current: ''
  	}
    ...

**[2]:** Importe e registe o plugin no VueJS, é necessário passar algunas parâmetros, o router do vue-router, uma permissão padrão para o sistema e a store do Vuex:


    import Store from '../vuex/store'
    import Router from '../routes/router'
    import Acl from 'vue-acl'
    Vue.use( Acl, { router: Router, d_permission: 'any', store: Store } )


**[3]:** Adicione um metadado nas suas rotas dizendo qual permissão necessária para acessar a rota, use ponto (.) para separar mais de uma permissão, outro metadado usado é o `fail`, que indicará para qual rota redirecionar em caso de erro:

  	export default [
  	  { path: '/'                   , component: Example              , meta: { permission: 'admin.any' } },
  	  { path: '/resource'           , component: Resource             , meta: { permission: 'admin.any', fail: '/' } },
  	  { path: '/vuex'               , component: Vuex                 , meta: { permission: 'admin', fail: '/' } }
  	]



**[4]:** Nos componentes use o metodo global `can()` para definir se determinada permissão é compatível com a atualmente ativa:

  	<router-link v-show='can("admin.any")' to='/'>Router test</router-link> |
  	<router-link v-show='can("admin.any")' to='/resource'>Resource test</router-link> |
  	<router-link v-show='can("admin")' to='/vuex'>Vuex test</router-link>

Esse método recebe como parâmetro uma string com as permissões que você quer checar, quando mais de uma use ponto (.) para separa-las, o retorno será um `bool` mostrando se você tem ou não a permissão certa.

Para trocar a permissão atual do sistema use o método global `checkPermission()`, passando como parametro a nova permissão do sistema:

	 this.changeAccess('admin')

**NOTE:** Esse método é um atalho para a variável `$store.state.acl_current`

### Contribuindo


Para ajudar no desenvolvimento e expansão desse plugin faça um FORK do repositório na sua conta do GitHub, quando realizar as modificações faça um PULL REQUEST, iremos analisar se houve uma melhoria com a modificaçao, se sim então elas estará presente aqui.

Caso prefira, escreva o código ES6 e transpile ele para ES5 usando o Babel.

Dependências do node precisam ser escritas em ES5, mas optei por escrever o plugin em ES6, usando então o Babel para converter o código:

    npm run transpile

*Certifique-se de ter o babel-cli instalado globalmente*