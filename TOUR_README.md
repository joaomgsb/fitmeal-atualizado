# 🎯 Sistema de Tour Interativo - FitMeal

## Visão Geral

O sistema de tour interativo do FitMeal é uma funcionalidade que guia novos usuários através das principais funcionalidades da plataforma, proporcionando uma experiência de onboarding mais envolvente e educativa.

## ✨ Funcionalidades

### 1. **Tour Automático para Novos Usuários**
- Aparece automaticamente após o primeiro login
- Modal de boas-vindas com opção de iniciar o tour
- Pode ser pulado se o usuário preferir

### 2. **Tour Interativo com Overlay**
- Overlay escuro que destaca elementos específicos
- Setas e círculos destacando cada funcionalidade
- Tooltips explicativos para cada seção
- Navegação entre passos (anterior/próximo)

### 3. **Botão Flutuante de Ajuda**
- Botão circular fixo no canto inferior direito
- Permite acessar o tour a qualquer momento
- Disponível para usuários logados

### 4. **Persistência de Estado**
- Status do tour salvo no Firestore
- Usuários não precisam repetir o tour
- Histórico de quando o tour foi completado

## 🚀 Como Funciona

### Fluxo para Novos Usuários:
1. Usuário se cadastra na plataforma
2. Sistema cria documento no Firestore com `isNewUser: true`
3. Após login, modal de boas-vindas aparece
4. Usuário pode escolher iniciar ou pular o tour
5. Se iniciar, tour guia através de todas as funcionalidades

### Passos do Tour:
1. **Página Inicial** - Apresentação geral
2. **News** - Seção de notícias e atualizações
3. **Receitas** - Biblioteca de receitas
4. **Planos** - Criação de planos alimentares
5. **Sugestões** - Receitas personalizadas
6. **Reconhecimento IA** - Identificação de alimentos
7. **Lista de Compras** - Organização de compras
8. **Rastreador** - Monitoramento de progresso
9. **Perfil** - Configurações pessoais

## 🛠️ Componentes

### `TourContext.tsx`
- Contexto React para gerenciar estado do tour
- Lógica de detecção de novos usuários
- Persistência no Firestore

### `TourOverlay.tsx`
- Overlay principal do tour
- Destaque de elementos
- Tooltips e controles de navegação

### `TourWelcomeModal.tsx`
- Modal de boas-vindas
- Aparece para novos usuários
- Opções de iniciar ou pular

### `TourFloatingButton.tsx`
- Botão flutuante de ajuda
- Acesso rápido ao tour
- Posicionamento responsivo

## 📱 Responsividade

- Funciona em dispositivos móveis e desktop
- Posicionamento automático dos tooltips
- Adaptação a diferentes tamanhos de tela
- Suporte a orientação landscape/portrait

## 🎨 Personalização

### Cores e Estilos:
- Usa as cores primárias do tema (`primary-500`, `primary-600`)
- Animações suaves com Framer Motion
- Sombras e bordas consistentes com o design system

### Conteúdo:
- Textos em português brasileiro
- Descrições claras e objetivas
- Tom amigável e acolhedor

## 🔧 Configuração

### Firestore:
- Coleção `users` com campos:
  - `isNewUser`: boolean (indica se é novo usuário)
  - `hasCompletedTour`: boolean (status do tour)
  - `tourCompletedAt`: timestamp (quando foi completado)
  - `tourSkippedAt`: timestamp (quando foi pulado)

### Dependências:
- `framer-motion` para animações
- `lucide-react` para ícones
- Firebase para persistência

## 🚀 Como Usar

### Para Desenvolvedores:
1. Importe o `TourProvider` no App.tsx
2. Adicione os componentes do tour no layout principal
3. Configure os seletores CSS para os elementos alvo

### Para Usuários:
1. **Novos usuários**: Tour aparece automaticamente
2. **Usuários existentes**: Clique no botão de ajuda (canto inferior direito)
3. **Navegação**: Use os botões anterior/próximo ou pule o tour

## 🔮 Futuras Melhorias

- [ ] Tour específico por funcionalidade
- [ ] Vídeos explicativos integrados
- [ ] Métricas de engajamento com o tour
- [ ] Personalização baseada no perfil do usuário
- [ ] Tour em diferentes idiomas
- [ ] Acessibilidade aprimorada (navegação por teclado, leitores de tela)

## 📝 Notas Técnicas

- Z-index alto (9999) para garantir que apareça sobre outros elementos
- Uso de `getBoundingClientRect()` para posicionamento preciso
- Event listeners para redimensionamento da janela
- Cleanup automático de event listeners
- Tratamento de erros para elementos não encontrados

## 🐛 Solução de Problemas

### Tour não aparece:
- Verifique se o usuário está logado
- Confirme se o documento existe no Firestore
- Verifique os seletores CSS dos elementos alvo

### Posicionamento incorreto:
- Elementos podem estar ocultos ou com `display: none`
- Verifique se os seletores CSS estão corretos
- Teste em diferentes tamanhos de tela

### Performance:
- Tour usa `useEffect` com dependências otimizadas
- Animações são otimizadas com Framer Motion
- Event listeners são limpos adequadamente 