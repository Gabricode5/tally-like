# Formify 🚀

**Formify** est une plateforme moderne de création de formulaires intelligente avec intégration IA, conçue pour les professionnels et les équipes qui souhaitent créer, partager et analyser des formulaires facilement.

## ✨ Fonctionnalités principales

- 🎨 **Constructeur de formulaires intuitif** - Interface drag-and-drop moderne
- 🤖 **IA intégrée** - Suggestions automatiques de champs et analyse des réponses
- 📊 **Analytics avancés** - Insights intelligents sur vos données
- 🔐 **Authentification sécurisée** - JWT avec cookies httpOnly
- 💳 **Facturation Stripe** - Plans gratuits et payants
- 📧 **Notifications email** - Intégration SendGrid/Postmark
- 📁 **Export CSV** - Téléchargement des données
- 👥 **Gestion d'équipe** - RBAC et collaboration
- 📱 **Responsive design** - Optimisé mobile et desktop

## 🛠️ Stack technique

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript
- **Styling** : TailwindCSS avec @tailwindcss/forms
- **Base de données** : PostgreSQL via Supabase
- **ORM** : Prisma
- **Authentification** : JWT (httpOnly cookies)
- **Paiements** : Stripe
- **IA** : OpenAI API
- **Emails** : SendGrid/Postmark
- **Déploiement** : Vercel
- **Tests** : Jest + Supertest

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- PostgreSQL (Supabase recommandé)
- Comptes Stripe et OpenAI

### Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/formify.git
   cd formify
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Remplir les variables dans `.env.local` :
   ```env
   # Base de données
   DATABASE_URL="postgresql://user:password@localhost:5432/formify"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PRICE_PRO="price_..."
   STRIPE_PRICE_TEAM="price_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # OpenAI
   OPENAI_API_KEY="sk-..."
   
   # Email
   EMAIL_PROVIDER="postmark"
   POSTMARK_API_KEY="your-postmark-key"
   
   # App
   PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Configuration de la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir l'application**
   ```
   http://localhost:3000
   ```

## 📦 Structure du projet

```
formify/
├── app/                    # Next.js App Router
│   ├── api/               # Routes API
│   ├── dashboard/         # Pages dashboard
│   ├── login/            # Page de connexion
│   └── signup/           # Page d'inscription
├── components/            # Composants React
│   ├── dashboard/        # Composants dashboard
│   ├── layout/           # Layout components
│   ├── sections/         # Sections de la page d'accueil
│   └── ui/               # Composants UI de base
├── lib/                  # Utilitaires et configurations
│   ├── auth.ts          # Authentification
│   ├── db.ts            # Configuration Prisma
│   ├── stripe.ts        # Intégration Stripe
│   ├── openai.ts        # Intégration OpenAI
│   └── email.ts         # Service email
├── prisma/              # Schéma et migrations
├── hooks/               # React hooks personnalisés
├── __tests__/           # Tests Jest
└── public/              # Assets statiques
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests en mode watch
npm run test:watch

# Tests e2e
npm run test:e2e
```

## 🚀 Déploiement sur Vercel

1. **Connecter le repository GitHub à Vercel**
2. **Configurer les variables d'environnement** dans Vercel
3. **Déployer automatiquement** à chaque push

### Variables d'environnement Vercel

```env
DATABASE_URL=https://your-project.supabase.co:5432/postgres
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
PUBLIC_APP_URL=https://your-app.vercel.app
```

## 💰 Plans et tarifs

- **Gratuit** : 50 réponses/mois, 3 formulaires
- **Pro** : 9€/mois - 5 000 réponses, formulaires illimités
- **Team** : 29€/mois - 100 000 réponses, collaboration d'équipe

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- 📧 Email : hello@formify.com
- 📖 Documentation : [docs.formify.com](https://docs.formify.com)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-username/formify/issues)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) pour le framework
- [TailwindCSS](https://tailwindcss.com/) pour le styling
- [Prisma](https://prisma.io/) pour l'ORM
- [Stripe](https://stripe.com/) pour les paiements
- [OpenAI](https://openai.com/) pour l'IA

---

**Formify** - Créez des formulaires intelligents en quelques minutes ✨
