# Full Cycle 4 - REST e Níveis de Maturidade na prática

## Descrição

Este repositório contém o código fonte do projeto desenvolvido durante o curso Full Cycle 4.0 - REST e Níveis de Maturidade na prática.

Professor: [**Luiz Carlos**](https://github.com/argentinaluiz)

## Introdução

Neste curso, exploramos os conceitos de REST e seus níveis de maturidade na prática, usando como exemplo um sistema de E-commerce que não implementa REST corretamente.

- Reposotorio base: [Full-Cycle-Rest](https://github.com/devfullcycle/fc4-rest-niveis-maturidade)

## Executar o projeto

- Windons

```cmd
  npm install
  npm run dev
```

- Linux

```bash
  ./start.sh
```

## Exemplo REST meia boca para E-commerce -

### 🛠️ Detalhes do Nível 0 (The Swamp of POX)

Nesta etapa inicial, o HTTP é utilizado apenas como um túnel de transporte para as requisições, sem aproveitar quase nenhum recurso do protocolo.

- **Abstração**: Existe apenas um único ponto de entrada (endpoint) para toda a aplicação.
- **Exemplo**: POST /api/v1/gateway enviando no corpo da mensagem qual operação deve ser executada (ex: {"comando": "buscarSaldo"}).
- **Foco**: Comunicação básica via protocolo de transporte (estilo RPC).

### Implementacao do Level 0

| Operação                                 | Método HTTP | Path                             |
| ---------------------------------------- | ----------- | -------------------------------- |
| **Autenticação JWT**                     |             |                                  |
| JWT login                                | POST        | /jwt/login                       |
| **Autenticação por Sessão**              |             |                                  |
| Session login                            | POST        | /session/login                   |
| Session logout                           | POST        | /session/logout                  |
| **Clientes**                             |             |                                  |
| Create a customer                        | POST        | /customers/createCustomer        |
| Get a customer by ID                     | GET         | /admin/customers/getCustomerById |
| List customers with pagination           | GET         | /admin/customers/listCustomers   |
| Update a customer                        | POST        | /admin/customers/updateCustomer  |
| Delete a customer                        | POST        | /admin/customers/deleteCustomer  |
| **Categorias**                           |             |                                  |
| Create a category                        | POST        | /admin/categories/createCategory |
| Get a category by slug                   | GET         | /categories/getCategoryBySlug    |
| List categories with pagination          | GET         | /categories/listCategories       |
| List categories in admin with pagination | GET         | /admin/categories/listCategories |
| Update a category                        | POST        | /admin/categories/updateCategory |
| Delete a category                        | POST        | /admin/categories/deleteCategory |
| **Produtos**                             |             |                                  |
| Create a product                         | POST        | /admin/products/createProduct    |
| Get a product by ID                      | GET         | /admin/products/getProductById   |
| Get a product by slug                    | GET         | /products/getProductBySlug       |
| Update a product                         | POST        | /admin/products/updateProduct    |
| Delete a product                         | POST        | /admin/products/deleteProduct    |
| List products with pagination            | GET         | /products/listProducts           |
| List products in admin with pagination   | GET         | /admin/products/listProducts     |
| Get CSV of products                      | GET         | /admin/products/listProducts.csv |
| **Carrinho**                             |             |                                  |
| Add an item to the cart                  | POST        | /carts/addItemToCart             |
| Get a cart by ID                         | GET         | /carts/getCart                   |
| Remove an item from the cart             | POST        | /carts/removeItemFromCart        |
| Clear the cart                           | POST        | /carts/clearCart                 |
| **Pedidos**                              |             |                                  |
| Create an order                          | POST        | /orders/createOrder              |
| List orders with pagination              | GET         | /orders/listOrders               |

---

## Exemplo Arch-REST para E-commerce parcialmente estruturado - Level 1

### 🛠️ Detalhes do Nível 1 (Recursos)

Nesta etapa, a API deixa de ser um "buraco negro" de um único endpoint e passa a organizar as responsabilidades por URIs específicas.

- **Abstração**: Cada entidade de domínio possui sua própria identidade na rede.
- **Exemplo**: Em vez de POST /api/v1/service, utilizamos POST /contas/{id} ou /clientes para interagir diretamente com o recurso.
- **Foco**: Organização, divisão de responsabilidades e endereçamento de recursos.

### Implementacao do Level 1

| Operação                     | Método HTTP | Path                                                                                 |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| **Autenticação JWT**         |             |                                                                                      |
| JWT Login                    | POST        | /auth/login                                                                          |
| **Autenticação por Sessão**  |             |                                                                                      |
| Session Login                | POST        | /session/login                                                                       |
| Session Logout               | POST        | /session/logout                                                                      |
| **Clientes**                 |             |                                                                                      |
| Criar Cliente                | POST        | /customers                                                                           |
| Obter Cliente por ID         | GET         | /admin/customers/{{ customer_id }}                                                   |
| Listar Clientes (Admin)      | GET         | /admin/customers?page=1&limit=10                                                     |
| Atualizar Cliente            | POST        | /admin/customers/{{ customer_id }}                                                   |
| Deletar Cliente              | POST        | /admin/customers/{{ customer_id }}/delete                                            |
| **Categorias**               |             |                                                                                      |
| Criar Categoria              | POST        | /admin/categories                                                                    |
| Obter Categoria por Slug     | GET         | /categories/{{ category_slug }}                                                      |
| Listar Categorias (Público)  | GET         | /categories?page=1&limit=10&name=Category                                            |
| Listar Categorias (Admin)    | GET         | /admin/categories?page=1&limit=10&name=Category                                      |
| Atualizar Categoria          | POST        | /admin/categories/{{ category_id }}                                                  |
| Deletar Categoria            | POST        | /admin/categories/{{ category_id }}/delete                                           |
| **Produtos**                 |             |                                                                                      |
| Criar Produto                | POST        | /admin/products                                                                      |
| Obter Produto por ID (Admin) | GET         | /admin/products/{{ product_id }}                                                     |
| Obter Produto por Slug       | GET         | /products/slug/{{ product_slug }}                                                    |
| Atualizar Produto            | POST        | /admin/products/{{ product_id }}                                                     |
| Deletar Produto              | POST        | /admin/products/{{ product_id }}/delete                                              |
| Listar Produtos (Público)    | GET         | /products?page=1&limit=10                                                            |
| Listar Produtos (Admin)      | GET         | /admin/products?page=1&limit=10&name=Product&categories_slug=category-slug&user_id=1 |
| Exportar Produtos (CSV)      | GET         | /admin/products/products.csv                                                         |
| **Carrinho**                 |             |                                                                                      |
| Adicionar Item ao Carrinho   | POST        | /cart/items                                                                          |
| Obter Carrinho               | GET         | /cart                                                                                |
| Remover Item do Carrinho     | POST        | /cart/items/1/remove                                                                 |
| Limpar Carrinho              | POST        | /cart/clear                                                                          |
| **Pedidos**                  |             |                                                                                      |
| Criar Pedido                 | POST        | /orders                                                                              |
| Listar Pedidos               | GET         | /orders?page=1&limit=10                                                              |

---

## Exemplo Arch-REST para E-commerce Estruturado - Level 2

### 🛠️ Detalhes do Nível 2 (Verbos HTTP)

Aqui, a API passa a utilizar o protocolo HTTP em sua plenitude semântica, adotando diferentes métodos para diferentes intenções e utilizando códigos de status apropriados.

- **Abstração**: Padronização das interações com os recursos através dos verbos padrão (GET, POST, PUT, DELETE).
- **Exemplo**: GET /transacoes para listar dados, POST /pagamentos para criar um registro e retorno de status code 201 Created ou 404 Not Found.
- **Foco**: Padronização da interface e tratamento de erros via protocolo.

### Lista de verbos

| **Verbo** | **Objetivo**                                                                 | **IdPotente** | **Safe** |
| --------- | ---------------------------------------------------------------------------- | ------------- | -------- |
| `GET`     | **Recupera dados de um recurso** específico sem alterá-lo.                   | Sim           | Sim      |
| `POST`    | **Cria um novo recurso** ou envia dados para processamento.                  | Não           | Não      |
| `PUT`     | **Substitui/Atualiza integralmente** um recurso existente.                   | Sim           | Não      |
| `PATCH`   | **Atualiza parcialmente** campos específicos de um recurso.                  | Sim           | Não      |
| `DELETE`  | **Remove/Exclui** o recurso especificado.                                    | Sim           | Não      |
| `OPTIONS` | Verifica quais **métodos e opções** são permitidos para o recurso.           | Sim           | Sim      |
| `HEAD`    | Retorna apenas os **cabeçalhos** (meta-dados), sem o corpo da resposta.      | Sim           | Sim      |
| `TRACE`   | Realiza um teste de **loop-back** para ver o caminho da requisição.          | Sim           | Não      |
| `CONNECT` | Estabelece um **túnel** para o servidor (comum em conexões HTTPS via Proxy). | Não           | Não      |

#### Notas Importantes:

- **Safe (Seguro)**: São métodos que não alteram o estado do servidor (apenas leitura).
- **Idempotente**: Significa que fazer a mesma requisição várias vezes terá o mesmo efeito que fazê-la uma única vez.
- **Nota sobre o PATCH**: Embora na sua tabela esteja como "Sim", tecnicamente ele pode não ser idempotente dependendo de como é implementado (ex: um comando de "incrementar valor"), mas em APIs REST modernas, busca-se projetá-lo para ser.
- **PUT vs PATCH**: Use PUT quando quiser enviar o objeto inteiro para substituir o que está lá. Use PATCH quando quiser mudar apenas o "e-mail" de um usuário, por exemplo, sem precisar enviar o resto dos dados.

### Implementacao do Level 2

| Operação                     | Método HTTP | Path                                                                                 |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| **Autenticação JWT**         |             |                                                                                      |
| JWT Login                    | POST        | /auth/login                                                                          |
| **Autenticação por Sessão**  |             |                                                                                      |
| Session Login                | POST        | /session/login                                                                       |
| Session Logout               | POST        | /session/logout                                                                      |
| **Clientes**                 |             |                                                                                      |
| Criar Cliente                | POST        | /customers                                                                           |
| Obter Cliente por ID         | GET         | /admin/customers/:customerId                                                         |
| Listar Clientes (Admin)      | GET         | /admin/customers?page=1&limit=10                                                     |
| Atualizar Cliente            | PATCH       | /admin/customers/:customerId                                                         |
| Deletar Cliente              | DELETE      | /admin/customers/:customerId                                                         |
| **Categorias**               |             |                                                                                      |
| Criar Categoria              | POST        | /admin/categories                                                                    |
| Obter Categoria por Slug     | GET         | /categories/:categorySlug                                                            |
| Obter Categoria por ID       | GET         | /admin/categories/:categoryId                                                        |
| Listar Categorias (Público)  | GET         | /categories?page=1&limit=10&name=Category                                            |
| Listar Categorias (Admin)    | GET         | /admin/categories?page=1&limit=10&name=Category                                      |
| Atualizar Categoria          | PATCH       | /admin/categories/:categoryId                                                        |
| Deletar Categoria            | DELETE      | /admin/categories/:categoryId                                                        |
| **Produtos**                 |             |                                                                                      |
| Criar Produto                | POST        | /admin/products                                                                      |
| Obter Produto por ID (Admin) | GET         | /admin/products/:productId                                                           |
| Obter Produto por Slug       | GET         | /products/slug/:productSlug                                                          |
| Atualizar Produto            | PATCH       | /admin/products/:productId                                                           |
| Deletar Produto              | DELETE      | /admin/products/:productId                                                           |
| Listar Produtos (Público)    | GET         | /products?page=1&limit=10&name=Product&categories_slug=category-slug                 |
| Listar Produtos (Admin)      | GET         | /admin/products?page=1&limit=10&name=Product&categories_slug=category-slug&user_id=1 |
| Exportar Produtos (CSV)      | GET         | /admin/products/products.csv                                                         |
| **Carrinho**                 |             |                                                                                      |
| Adicionar Item ao Carrinho   | POST        | /cart/items                                                                          |
| Obter Carrinho               | GET         | /cart                                                                                |
| Remover Item do Carrinho     | DELETE      | /cart/items/:itemId                                                                  |
| Limpar Carrinho              | POST        | /cart/clear                                                                          |
| **Pedidos**                  |             |                                                                                      |
| Criar Pedido                 | POST        | /orders                                                                              |
| Listar Pedidos               | GET         | /orders?page=1&limit=10                                                              |

---

## Exemplo Arch-REST para E-commerce HATEOAS - Level 3

### 🛠️ Detalhes do Nível 3 (HATEOAS)

O nível mais alto de maturidade, onde a API se torna autodescritiva, fornecendo links que guiam o cliente sobre quais são as próximas ações possíveis.

- **Abstração**: Introdução de hipermídia como motor do estado da aplicação.
- **Exemplo**: Ao consultar uma conta via GET, o JSON de resposta inclui um campo links com URLs para efetuar_deposito, extrato ou encerrar_conta.
- **Foco**: Desacoplamento entre cliente e servidor, permitindo que a API evolua sem quebrar o cliente.

### Implementacao do Level 3
