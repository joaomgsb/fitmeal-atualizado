# 🏋️‍♂️ Biofitness - Plataforma de Receitas e Planos Alimentares Fitness

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Páginas e Funcionalidades Detalhadas](#páginas-e-funcionalidades-detalhadas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração e Instalação](#configuração-e-instalação)
- [Estrutura de Dados](#estrutura-de-dados)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Integração com IA](#integração-com-ia)
- [Deploy e Produção](#deploy-e-produção)

## 🎯 Sobre o Projeto

A **Biofitness** é uma plataforma web completa voltada para nutrição esportiva e fitness, desenvolvida para academias e seus alunos. O sistema oferece receitas personalizadas, planos alimentares baseados em IA, rastreamento de progresso e ferramentas de gestão nutricional.

### 🎨 Design e UX
- Interface moderna e responsiva
- Design system consistente com cores primárias em azul (#0ea5e9)
- Animações suaves com Framer Motion
- Experiência otimizada para mobile e desktop
- Componentes reutilizáveis e modulares

## ⚡ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Cadastro com código de acesso**: Apenas alunos com códigos válidos fornecidos pela academia podem se registrar
- **Login/Logout seguro**: Autenticação via Firebase Auth
- **Recuperação de senha**: Sistema de reset por email
- **Perfis diferenciados**: Usuários normais e administradores

### 🍽️ Receitas Fitness
- **Catálogo extenso**: Mais de 500 receitas categorizadas
- **Filtros avançados**: Por categoria, dificuldade, tempo de preparo
- **Busca inteligente**: Por ingredientes, tags ou nome
- **Informações nutricionais**: Macros detalhados para cada receita
- **Lista de compras**: Adicionar ingredientes automaticamente

### 📊 Planos Alimentares Personalizados
- **Geração por IA**: Planos criados com base no perfil do usuário
- **Planos pré-definidos**: Perda de peso, ganho muscular, definição
- **Personalização completa**: Considera objetivos, preferências e restrições
- **Download em PDF**: Exportação para consulta offline
- **Salvamento**: Histórico de planos gerados

### 📈 Rastreamento de Progresso
- **Histórico de peso**: Gráficos de evolução temporal
- **Medidas corporais**: Registro de tórax, cintura, quadril, braços e coxas
- **Cálculo de IMC**: Automático baseado nos dados inseridos
- **Metas personalizadas**: Baseadas no objetivo fitness escolhido

### 🧮 Calculadoras Fitness
- **Calculadora de IMC**: Índice de Massa Corporal com faixas etárias específicas
- **Calculadora de Hidratação**: Consumo diário de água baseado em peso, idade e atividade física
- **Calculadora de Proteína**: Necessidade proteica diária baseada em objetivo e nível de atividade
- **Interface intuitiva**: Design responsivo com resultados em tempo real
- **Dicas personalizadas**: Orientações específicas para cada cálculo

### 🛒 Lista de Compras Inteligente
- **Geração automática**: A partir de receitas selecionadas
- **Organização por receita**: Identificação da origem dos ingredientes
- **Controle de itens**: Marcar como comprado/não comprado
- **Adição manual**: Itens personalizados pelo usuário
- **Exportação PDF**: Download da lista para consulta offline

### 🤖 Sugestões de Receitas por IA
- **Personalização avançada**: Baseada no perfil nutricional
- **Variedade garantida**: Algoritmo evita repetições
- **Consideração de restrições**: Alergias e preferências alimentares
- **Receitas únicas**: Criadas especificamente para cada usuário

### 📰 Sistema de News
- **Artigos especializados**: Conteúdo sobre nutrição, treino e lifestyle
- **Categorização**: Organização por temas específicos
- **Sistema de curtidas**: Interação com o conteúdo
- **Comentários**: Sistema completo de comentários com moderação
- **Bookmarks**: Salvar artigos favoritos
- **Busca avançada**: Filtros por categoria e busca textual

### 👨‍💼 Painel Administrativo
- **Gestão de códigos**: Criação, visualização e exclusão
- **Geração em lote**: Criação de múltiplos códigos simultaneamente
- **Exportação**: Download de códigos em formato Excel
- **Estatísticas**: Controle de códigos usados/disponíveis
- **Busca e filtros**: Localização rápida de códigos específicos
- **Gestão de News**: Criação e moderação de artigos

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Componentes de autenticação
│   ├── home/            # Componentes da página inicial
│   ├── meal-plan/       # Componentes de planos alimentares
│   ├── navigation/      # Header, Footer, Navbar
│   ├── profile/         # Componentes do perfil
│   ├── recipe/          # Componentes de receitas
│   └── shopping/        # Componentes da lista de compras
├── contexts/            # Contextos React (Auth)
├── data/               # Dados estáticos (receitas)
├── hooks/              # Custom hooks
├── layouts/            # Layouts das páginas
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
└── styles/             # Estilos globais
```

## 📱 Páginas e Funcionalidades Detalhadas

### 🏠 **Página Inicial (`/`)**
**Arquivo**: `src/pages/HomePage.tsx`

**Funcionalidades**:
- **Hero Section**: Apresentação da plataforma com busca rápida
- **Seção de Features**: 4 cards explicando as principais funcionalidades
- **Receitas em Destaque**: Grid com as receitas mais populares
- **Apresentação da Nutricionista**: Informações sobre Viviane Ferreira (CRN 24028)
- **Seção de Benefícios**: Lista de vantagens da plataforma
- **Call-to-Action**: Botões para começar e explorar receitas
- **Estatísticas**: Números de usuários, receitas e satisfação
- **Busca Rápida**: Campo de busca com sugestões (proteicas, pré-treino, baixas calorias)

### 🍳 **Página de Receitas (`/receitas`)**
**Arquivo**: `src/pages/RecipesPage.tsx`

**Funcionalidades**:
- **Catálogo Completo**: Exibição de todas as receitas disponíveis
- **Sistema de Busca**: Campo de busca em tempo real
- **Filtros Avançados**:
  - Por categoria (pré-treino, pós-treino, low-carb, etc.)
  - Por dificuldade (fácil, médio, difícil)
  - Combinação de múltiplos filtros
- **Grid Responsivo**: Layout adaptável para diferentes telas
- **Contador de Resultados**: Mostra quantas receitas foram encontradas
- **Reset de Filtros**: Botão para limpar todos os filtros

### 📖 **Detalhes da Receita (`/receitas/:id`)**
**Arquivo**: `src/pages/RecipeDetailPage.tsx`

**Funcionalidades**:
- **Informações Completas**: Todos os dados da receita
- **Calculadora de Porções**: Ajuste automático de ingredientes
- **Lista de Ingredientes**: Com checkbox para seleção
- **Modo de Preparo**: Passo a passo numerado
- **Informações Nutricionais**: Gráficos de macronutrientes
- **Adição à Lista de Compras**: Ingredientes selecionados
- **Receitas Similares**: Sugestões baseadas na categoria
- **Dicas Nutricionais**: Orientações específicas da receita
- **Breadcrumb**: Navegação hierárquica

### 🥗 **Planos Alimentares (`/planos`)**
**Arquivo**: `src/pages/MealPlansPage.tsx`

**Funcionalidades**:
- **Gerador de Planos Personalizados**: Baseado no perfil do usuário
- **Planos Pré-definidos**: 3 opções principais
  - **Perda de Peso**: Déficit calórico controlado
  - **Ganho Muscular**: Superávit calórico com foco em proteínas
  - **Definição Muscular**: Protocolo de carb cycling
- **Como Funciona**: Explicação do processo em 4 etapas
- **Depoimentos**: Histórias de sucesso de usuários
- **Comparação de Planos**: Características de cada plano

### 📋 **Detalhes do Plano (`/planos/:id` ou `/planos/personalizado`)**
**Arquivo**: `src/pages/MealPlanDetailPage.tsx`

**Funcionalidades**:
- **Visualização Completa**: Todas as refeições do dia
- **Cronograma Diário**: Horários e descrições das refeições
- **Informações Nutricionais**: Macros por refeição e totais diários
- **Características do Plano**: Features específicas
- **Dicas de Preparação**: Orientações práticas
- **Substituições**: Alternativas para cada grupo alimentar
- **Download PDF**: Exportação completa do plano
- **Salvamento**: Adicionar aos planos salvos
- **Plano Semanal**: Variações para cada dia (planos pré-definidos)

### 🤖 **Sugestões de Receitas (`/sugestoes-receitas`)**
**Arquivo**: `src/pages/SuggestedRecipesPage.tsx`

**Funcionalidades**:
- **Geração por IA**: Receitas personalizadas usando OpenAI
- **Baseado no Perfil**: Considera objetivos, preferências e restrições
- **Receitas Únicas**: Algoritmo evita repetições
- **Informações Completas**: Ingredientes, preparo e macros
- **Tags Personalizadas**: Classificação automática
- **Geração Manual**: Botão para criar novas sugestões

### 📊 **Perfil do Usuário (`/perfil`)**
**Arquivo**: `src/pages/ProfilePage.tsx`

**Funcionalidades**:
- **4 Abas Principais**:

#### 👤 **Aba "Meu Perfil"**:
- **Informações Pessoais**: Nome, email, gênero, idade, altura, peso
- **Objetivo Fitness**: Seleção entre perda de peso, ganho muscular ou definição
- **Preferências Alimentares**: Múltipla seleção de dietas
- **Alergias/Intolerâncias**: Lista personalizada
- **Modo de Edição**: Toggle para editar/salvar informações
- **Upload de Avatar**: Foto de perfil personalizada

#### 💾 **Aba "Planos Salvos"**:
- **Lista de Planos**: Todos os planos alimentares salvos
- **Edição de Títulos**: Renomeação de planos personalizados
- **Visualização de Macros**: Resumo nutricional de cada plano
- **Acesso Rápido**: Link direto para detalhes do plano
- **Exclusão**: Remoção de planos não utilizados
- **Data de Criação**: Histórico temporal

#### 📈 **Aba "Meu Progresso"**:
- **Progresso de Peso**:
  - Gráfico de evolução temporal
  - Peso atual vs meta
  - Cálculo automático de IMC
  - Registro de novos pesos
  - Reset do histórico
- **Medidas Corporais**:
  - Tórax, cintura, quadril, braços, coxas
  - Comparação com medidas anteriores
  - Registro de novas medidas
  - Reset das medidas

#### 🧮 **Seção "Calculadoras Fitness"** (dentro do perfil):
**Arquivo**: `src/components/profile/CalculatorTab.tsx`

- **Calculadora de IMC**:
  - Cálculo baseado em altura, peso e idade
  - Faixas de referência específicas para idosos (65+ anos)
  - Categorização automática (abaixo do peso, normal, sobrepeso, obesidade)
  - Interface visual com cores indicativas
- **Calculadora de Hidratação**:
  - Consumo diário baseado em peso corporal (35ml/kg)
  - Ajustes por faixa etária (idosos e jovens)
  - Multiplicadores por nível de atividade física
  - Conversão automática para copos de 250ml
- **Calculadora de Proteína**:
  - Necessidade baseada em objetivo fitness
  - Ajustes por nível de atividade física
  - Faixas de consumo (mínimo e máximo)
  - Orientações de distribuição nas refeições
- **Dicas Personalizadas**: Orientações específicas para cada calculadora
- **Design Responsivo**: Layout adaptável com cards individuais
- **Acesso**: Disponível como uma seção especial dentro da página de perfil
- **Integração**: Funciona em conjunto com os dados do perfil do usuário

### 🛒 **Lista de Compras (`/lista-compras`)**
**Arquivo**: `src/pages/ShoppingListPage.tsx`

**Funcionalidades**:
- **Adição Manual**: Formulário para novos itens
- **Adição Automática**: A partir de receitas selecionadas
- **Controle de Estado**: Marcar itens como comprados
- **Organização**: Identificação da receita de origem
- **Limpeza Seletiva**: Remover apenas itens marcados
- **Limpeza Total**: Reset completa da lista
- **Exportação PDF**: Download da lista formatada
- **Persistência Local**: Dados salvos no localStorage

### 📊 **Rastreador/Tracker (`/tracker`)**
**Arquivo**: `src/pages/TrackerPage.tsx`

**Funcionalidades**:
- **Rastreamento Nutricional**: Acompanhamento diário de macronutrientes
- **Registro de Refeições**: Adicionar alimentos consumidos ao longo do dia
- **Cálculo Automático**: Soma automática de calorias, proteínas, carboidratos e gorduras
- **Metas Personalizadas**: Definição de objetivos diários baseados no perfil
- **Visualização de Progresso**: Barras de progresso para cada macronutriente
- **Histórico Diário**: Acompanhamento da evolução ao longo dos dias
- **Busca de Alimentos**: Base de dados com informações nutricionais
- **Porções Customizáveis**: Ajuste de quantidades consumidas

### 📰 **News (`/news`)**
**Arquivo**: `src/pages/NewsPage.tsx`

**Funcionalidades**:
- **Artigos em Destaque**: Seção especial para conteúdo destacado
- **Categorização**: Nutrição, Treino, Suplementação, Receitas, Lifestyle, Ciência
- **Sistema de Busca**: Busca por título, conteúdo e tags
- **Filtros por Categoria**: Navegação organizada por temas
- **Interações Sociais**: Curtidas, comentários e bookmarks
- **Contador de Visualizações**: Métricas de engajamento
- **Layout Responsivo**: Grid adaptável para diferentes dispositivos

### 📖 **Detalhes do Artigo (`/news/:id`)**
**Arquivo**: `src/pages/NewsDetailPage.tsx`

**Funcionalidades**:
- **Visualização Completa**: Artigo formatado com imagens
- **Sistema de Comentários**: Comentários em tempo real com moderação
- **Interações**: Curtir, salvar e compartilhar artigos
- **Informações do Autor**: Dados do criador do conteúdo
- **Tags e Categorias**: Organização e descoberta de conteúdo
- **Contador de Visualizações**: Incremento automático
- **Compartilhamento**: API nativa de compartilhamento do navegador

### 🔧 **Painel Administrativo (`/admin`)**
**Arquivo**: `src/pages/AdminPage.tsx`

**Funcionalidades**:
- **Estatísticas**: Total, disponíveis e utilizados
- **Geração Individual**: Criação de códigos únicos
- **Geração em Lote**: Até 2000 códigos simultâneos
- **Busca e Filtros**: Localização rápida de códigos
- **Visualização**: Mostrar/ocultar códigos usados
- **Exportação**: Download em formato Excel
- **Exclusão**: Remoção de códigos específicos
- **Histórico**: Data de criação e uso

### 📰 **Gestão de News (`/admin/news`)**
**Arquivo**: `src/pages/AdminNewsPage.tsx`

**Funcionalidades**:
- **Criação de Artigos**: Editor completo com upload de imagens
- **Gestão de Conteúdo**: Edição, publicação e exclusão
- **Sistema de Categorias**: Organização por temas
- **Posts em Destaque**: Controle de visibilidade
- **Estatísticas**: Métricas de engajamento
- **Upload de Imagens**: Integração com serviços de hospedagem
- **Preview e Rascunhos**: Sistema de publicação controlada

### 🔐 **Páginas de Autenticação**

#### **Login (`/login`)**
**Arquivo**: `src/pages/LoginPage.tsx`
- Formulário de email e senha
- Link para recuperação de senha
- Redirecionamento pós-login
- Tratamento de erros

#### **Cadastro (`/cadastro`)**
**Arquivo**: `src/pages/SignUpPage.tsx`
- **Processo em 2 etapas**:
  1. **Validação do Código**: Verificação do código de acesso
  2. **Dados Pessoais**: Informações completas do perfil
- Validação em tempo real
- Criação automática do perfil no Firestore

#### **Recuperação de Senha (`/recuperar-senha`)**
**Arquivo**: `src/pages/ResetPasswordPage.tsx`
- Envio de email de recuperação
- Confirmação visual de envio
- Link de retorno ao login

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework de estilos
- **Framer Motion**: Animações
- **React Router DOM**: Roteamento
- **Lucide React**: Ícones

### **Backend e Dados**
- **Firebase Auth**: Autenticação
- **Firestore**: Banco de dados NoSQL
- **OpenAI API**: Geração de conteúdo por IA

### **Bibliotecas Especializadas**
- **React PDF**: Geração de PDFs
- **Recharts**: Gráficos e visualizações
- **React Hot Toast**: Notificações
- **Date-fns**: Manipulação de datas
- **XLSX**: Exportação para Excel

## ⚙️ Configuração e Instalação

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta Firebase
- Chave da API OpenAI

### **Variáveis de Ambiente**
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_OPENAI_API_KEY=sua_openai_key
```

### **Instalação**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🗄️ Estrutura de Dados

### **Usuários (`users/{userId}`)**
```typescript
interface UserProfile {
  name: string;
  email: string;
  isAdmin?: boolean;
  gender: string;
  age: number;
  height: number;
  weight: number;
  goal: 'emagrecimento' | 'hipertrofia' | 'definicao';
  activityLevel: string;
  dietPreferences: string[];
  allergies: string[];
  startDate: string;
  weightHistory: WeightEntry[];
  measurements: BodyMeasurements[];
  avatar?: string;
}
```

### **Planos Salvos (`users/{userId}/meal_plans/{planId}`)**
```typescript
interface SavedMealPlan {
  id: string;
  createdAt: string;
  plan: GeneratedPlan;
}
```

### **Códigos de Acesso (`access_codes/{codeId}`)**
```typescript
interface AccessCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  createdBy: string;
  description?: string;
}
```

### **Posts de News (`news_posts/{postId}`)**
```typescript
interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
  updatedAt: any;
  likes: string[];
  bookmarks: string[];
  views: number;
  commentsCount: number;
  featured: boolean;
  published: boolean;
}
```

## 🔒 Autenticação e Segurança

### **Regras de Segurança Firestore**
- **Usuários**: Acesso apenas aos próprios dados
- **Planos**: Vinculados ao usuário autenticado
- **Códigos de Acesso**: 
  - Leitura pública (para validação)
  - Criação/exclusão apenas para admins
  - Atualização controlada para marcar como usado
- **News Posts**:
  - Leitura pública para posts publicados
  - Criação/edição apenas para admins
  - Interações (likes, bookmarks) para usuários autenticados

### **Proteção de Rotas**
- **PrivateRoute**: Páginas que requerem autenticação
- **AdminRoute**: Páginas exclusivas para administradores
- Redirecionamento automático para login

## 🤖 Integração com IA

### **OpenAI GPT-4**
- **Geração de Planos**: Baseada no perfil do usuário
- **Sugestões de Receitas**: Personalizadas e variadas
- **Prompts Estruturados**: Para respostas consistentes
- **Formato JSON**: Padronização das respostas

### **Funcionalidades de IA**
1. **Análise de Perfil**: Interpretação de objetivos e preferências
2. **Cálculo Nutricional**: Macros baseados em metas
3. **Personalização**: Consideração de restrições alimentares
4. **Variedade**: Algoritmos para evitar repetições

## 🚀 Deploy e Produção

### **Build de Produção**
```bash
npm run build
```

### **Configurações de Deploy**
- **Netlify**: Configurado com `public/_redirects`
- **Variáveis de Ambiente**: Configuradas no painel do provedor
- **Otimizações**: Code splitting e lazy loading

### **Performance**
- Componentes otimizados
- Lazy loading de páginas
- Compressão de imagens
- Cache de dados do Firebase

## 📱 Responsividade

### **Breakpoints**
- **xs**: 480px (smartphones pequenos)
- **sm**: 640px (smartphones)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (telas grandes)

### **Design Responsivo**
- Grid adaptável em todas as páginas
- Navegação mobile com menu hambúrguer
- Formulários otimizados para touch
- Imagens responsivas

## 🎨 Sistema de Design

### **Cores Principais**
- **Primary**: #0ea5e9 (azul)
- **Accent**: #3B82F6 (azul secundário)
- **Energy**: #F97316 (laranja)
- **Success**: #10B981 (verde)
- **Warning**: #FBBF24 (amarelo)
- **Error**: #EF4444 (vermelho)

### **Tipografia**
- **Sans**: Inter (texto geral)
- **Display**: Montserrat (títulos)
- Hierarquia clara com 3 pesos máximo

### **Componentes**
- Cards com sombras suaves
- Botões com estados hover/focus
- Inputs com validação visual
- Animações de transição

## 📞 Contato e Suporte

### **Informações da Nutricionista**
- **Nome**: Viviane Ferreira
- **CRN**: 24028
- **WhatsApp**: (31) 99547-5184
- **Especialidade**: Nutrição Esportiva

### **Academia**
- **Endereço**: Rua Presidente Vargas, 1314, Jota - Centro, Brumadinho - MG
- **CEP**: 35460-000
- **Redes Sociais**: Instagram e Facebook

---

## 🏆 Conclusão

A **Biofitness** é uma plataforma completa que combina tecnologia moderna, inteligência artificial e expertise em nutrição esportiva para oferecer uma experiência única aos usuários. Com funcionalidades abrangentes desde o cadastro até o acompanhamento de progresso, incluindo calculadoras fitness avançadas e sistema de news, a plataforma atende todas as necessidades de quem busca uma alimentação alinhada aos objetivos fitness.

O sistema foi desenvolvido com foco na experiência do usuário, segurança dos dados e escalabilidade, utilizando as melhores práticas de desenvolvimento web moderno.