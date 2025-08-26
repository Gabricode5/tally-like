# Guide de contribution

Merci de votre intérêt pour contribuer à Tally-like SaaS ! 🎉

## 🚀 Comment contribuer

### 1. Fork et Clone

1. Fork ce repository sur GitHub
2. Clone votre fork localement :
   ```bash
   git clone https://github.com/votre-username/tally-like.git
   cd tally-like
   ```

### 2. Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer le client Prisma
npm run db:generate
```

### 3. Configuration

Configurez votre fichier `.env` avec vos propres clés :

```env
# Base de données (Supabase recommandé)
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=votre-secret-jwt

# Stripe (optionnel pour le développement)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_TEAM=price_...

# OpenAI (optionnel)
OPENAI_API_KEY=sk-...

# App URL
PUBLIC_APP_URL=http://localhost:3000
```

### 4. Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Lancer les tests
npm test

# Vérifier le type TypeScript
npm run type-check
```

### 5. Créer une branche

```bash
git checkout -b feature/votre-nouvelle-fonctionnalite
```

### 6. Développer et tester

- Écrivez votre code
- Ajoutez des tests si nécessaire
- Vérifiez que tous les tests passent : `npm test`
- Vérifiez le type : `npm run type-check`

### 7. Commit et Push

```bash
git add .
git commit -m "feat: ajouter une nouvelle fonctionnalité"
git push origin feature/votre-nouvelle-fonctionnalite
```

### 8. Pull Request

1. Allez sur GitHub
2. Créez une Pull Request depuis votre branche
3. Décrivez clairement vos changements
4. Attendez la review

## 📋 Standards de code

### TypeScript
- Utilisez TypeScript strict
- Ajoutez des types pour toutes les fonctions
- Évitez `any` quand possible

### Tests
- Ajoutez des tests pour les nouvelles fonctionnalités
- Utilisez Jest et Supertest
- Couvrez les cas d'erreur

### Style
- Utilisez Prettier pour le formatage
- Suivez les conventions ESLint
- Commentaires en français

## 🐛 Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs réel
   - Version du navigateur/OS

## ✨ Proposer une fonctionnalité

1. Créez une issue pour discuter de la fonctionnalité
2. Décrivez le cas d'usage
3. Proposez une implémentation
4. Attendez l'approbation avant de coder

## 📝 Structure du projet

```
├── app/                 # Pages Next.js (App Router)
├── components/          # Composants React
├── lib/                # Utilitaires et configurations
├── prisma/             # Schéma de base de données
├── __tests__/          # Tests Jest
└── public/             # Assets statiques
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests en mode watch
npm run test:watch

# Tests avec coverage
npm run test:coverage
```

## 🔧 Scripts utiles

```bash
# Base de données
npm run db:generate    # Générer le client Prisma
npm run db:push        # Pousser le schéma
npm run db:studio      # Interface Prisma Studio

# Build
npm run build          # Build de production
npm run vercel-build   # Build pour Vercel

# Linting
npm run lint           # ESLint
npm run type-check     # TypeScript
```

## 📞 Besoin d'aide ?

- Créez une issue sur GitHub
- Consultez la documentation dans le README
- Vérifiez les tests existants pour des exemples

Merci de contribuer ! 🙏
