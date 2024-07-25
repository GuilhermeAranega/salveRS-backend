# Salve RS

O Salve RS é uma aplicação de **gestão de voluntários e consertos à dispositivos eletrônicos** afetados pelas enchentes no Rio Grande do Sul.

A aplicação permite que um usuário se cadastre como pessoa física ou empresa para conseguir criar pedidos de conserto.
Também permite que voluntários se cadastrem com o objetivo de receber esses pedidos e ajudar a comunidade.

Os usuários conseguem criar pedidos, listar todos os dispositivos eletrônicos que precisam de conserto e até acompanhar o status do pedido pela ferramenta.

## Requisitos

### Requisitos funcionais

1. **Cadastro de Usuário**
   - [x] Permitir que o usuário se cadastre como pessoa física.
   - [x] Permitir que o usuário se cadastre como empresa.
   - [x] Permitir que voluntários se cadastrem na aplicação.

2. **Login e Autenticação**
   - [x] Permitir que usuários façam login na aplicação.
   - [ ] Permitir que voluntários façam login na aplicação.
   - [x] Implementar recuperação de senha.

3. **Gestão de Pedidos de Conserto**
   - [x] Permitir que usuários (pessoas físicas ou empresas) criem pedidos de conserto.
   - [x] Solicitar informações detalhadas sobre o dispositivo e o problema ao criar um pedido.
   - [x] Permitir que usuários editem ou cancelem pedidos de conserto.

4. **Listagem e Acompanhamento de Pedidos**
   - [x] Permitir que usuários listem todos os pedidos de conserto que criaram.
   - [x] Permitir que usuários acompanhem o status de cada pedido.
   - [ ] Permitir que voluntários listem todos os pedidos disponíveis para conserto.

5. **Gestão de Voluntários**
   - [ ] Permitir que voluntários aceitem pedidos de conserto.
   - [ ] Permitir que voluntários marquem pedidos como concluídos.
   - [ ] Registrar o histórico de consertos realizados pelos voluntários.

6. **Notificações**
   - [ ] Enviar notificações para os usuários sobre atualizações no status dos seus pedidos.
   - [ ] Enviar notificações para os voluntários sobre novos pedidos disponíveis.

7. **Interface de Usuário**
   - [ ] Fornecer uma interface amigável para navegação e uso da aplicação.
   - [ ] Implementar uma dashboard para usuários e voluntários visualizarem suas atividades e pedidos.