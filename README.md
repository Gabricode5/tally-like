# Tally-like SaaS

Un SaaS complet de création de formulaires avec Next.js 14, Prisma, Stripe, OpenAI et Supabase.

## 🚀 Stack Technique

- **Frontend**: Next.js 14 (App Router) + React + TypeScript + TailwindCSS
- **Backend**: Prisma + PostgreSQL (Supabase)
- **Auth**: JWT (cookies httpOnly)
- **Billing**: Stripe (checkout, portal, webhooks)
- **AI**: OpenAI (suggestions de champs, analyse des soumissions)
- **Emails**: SendGrid/Postmark
- **Déploiement**: Vercel
- **Tests**: Jest + Supertest

## ✨ Fonctionnalités

- 🔐 Authentification JWT sécurisée
- 📝 CRUD formulaires avec builder drag & drop
- 🤖 Suggestions de champs IA (OpenAI)
- 📊 Analyse intelligente des soumissions
- 💳 Billing Stripe (FREE/PRO/TEAM)
- 📧 Notifications email
- 📄 Export CSV
- 👥 RBAC équipes (OWNER/EDITOR/VIEWER)
- 🚀 Déploiement Vercel optimisé

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <repository>
cd tally-like
npm install
```

### 2. Configuration Supabase

1. Créer un projet sur [Supabase](https://supabase.com)
2. Récupérer les informations de connexion PostgreSQL
3. Configurer les variables d'environnement

### 3. Variables d'environnement

Créer un fichier `.env` basé sur `.env.example`:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Supabase (optionnel)
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Auth
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-...

# Emails
EMAIL_PROVIDER=postmark
POSTMARK_API_KEY=...
SENDGRID_API_KEY=...

# App URL
PUBLIC_APP_URL=http://localhost:3000
```

### 4. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers Supabase
npm run db:push

# (Optionnel) Seeder les données
npx prisma db seed
```

### 5. Démarrage

```bash
npm run dev
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests en mode watch
npm run test:watch

# Vérification TypeScript
npm run type-check
```

## 🚀 Déploiement Vercel

### 1. Configuration Vercel

1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Le fichier `vercel.json` est déjà configuré

### 2. Variables Vercel

Dans les paramètres du projet Vercel, ajouter :

- `DATABASE_URL` (Supabase PostgreSQL)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_TEAM`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `EMAIL_PROVIDER`
- `POSTMARK_API_KEY` / `SENDGRID_API_KEY`
- `PUBLIC_APP_URL`

### 3. Webhook Stripe

Configurer le webhook Stripe vers :
```
https://your-domain.vercel.app/api/billing/webhook
```

## 🤖 Intégration OpenAI

### Suggestions de champs

L'IA génère automatiquement des suggestions de champs basées sur le titre et la description du formulaire.

```typescript
// API: POST /api/ai/suggestions
{
  "title": "Formulaire de contact",
  "description": "Contactez-nous pour toute question"
}
```

### Analyse des soumissions

L'IA analyse les soumissions pour fournir des insights et statistiques.

```typescript
// API: GET /api/forms/[id]/analysis
{
  "totalSubmissions": 150,
  "completionRate": 95,
  "insights": ["Tendance positive", "Pic le mardi"],
  "topResponses": { "field1": ["réponse1", "réponse2"] }
}
```

## 💳 Configuration Stripe

### 1. Produits et prix

Créer dans Stripe :
- **PRO Plan**: 10€/mois
- **TEAM Plan**: 30€/mois

### 2. Webhook

Événements à écouter :
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 3. Test

```bash
# Tester le checkout
curl -X POST /api/billing/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"plan": "PRO"}'
```

## 📊 Structure de la base

### Modèles principaux

- **User**: Utilisateurs avec abonnements Stripe
- **Team**: Équipes avec RBAC
- **Form**: Formulaires avec champs
- **Submission**: Soumissions avec réponses
- **Subscription**: Abonnements Stripe

### RBAC Équipes

- **OWNER**: Accès complet
- **EDITOR**: Créer/modifier formulaires
- **VIEWER**: Lecture seule

## 🔧 Développement

### Scripts utiles

```bash
# Base de données
npm run db:studio    # Interface Prisma Studio
npm run db:migrate   # Migrations
npm run db:push      # Push direct

# Tests
npm test            # Tests unitaires
npm run test:watch  # Mode watch

# Build
npm run build       # Production build
npm run vercel-build # Build Vercel
```

### Architecture

```
├── app/
│   ├── api/           # Routes API Next.js
│   ├── dashboard/     # Pages dashboard
│   └── globals.css
├── components/
│   ├── dashboard/     # Composants dashboard
│   ├── layout/        # Header, Footer, etc.
│   └── ui/           # Composants UI réutilisables
├── lib/              # Utilitaires (auth, stripe, openai, etc.)
├── prisma/           # Schéma et migrations
└── __tests__/        # Tests Jest
```

## 🐛 Dépannage

### Erreurs courantes

1. **Stripe non configuré**
   - Vérifier `STRIPE_SECRET_KEY` dans `.env`
   - Les tests fonctionnent sans clé réelle

2. **OpenAI non configuré**
   - L'application fonctionne sans OpenAI
   - Suggestions par défaut utilisées

3. **Base de données Supabase**
   - Vérifier `DATABASE_URL`
   - Exécuter `npm run db:push`

### Logs

```bash
# Logs détaillés en développement
NODE_ENV=development npm run dev

# Logs Prisma
DEBUG=prisma:* npm run dev
```

## 📝 Licence

MIT License - voir LICENSE pour plus de détails.
