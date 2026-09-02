# E-radiologie Client

Application web client de la plateforme **E-radiologie**, développée avec **React**, **TypeScript**, **Vite** et **Tailwind CSS**.

> 🔒 **Projet propriétaire — Tous droits réservés**
>
> Ce dépôt contient le code source de l'application cliente **E-radiologie**. La présence du code dans un dépôt Git ne constitue pas une autorisation de copie, de redistribution, de commercialisation ou de réutilisation en dehors du cadre explicitement autorisé.

---

## Présentation

**E-radiologie Client** est l'interface web destinée aux utilisateurs de la plateforme E-radiologie.

L'application permet notamment de proposer une expérience pédagogique autour de la radiologie et de l'imagerie médicale, avec une architecture séparant :

- le frontend utilisateur ;
- le backend métier ;
- l'authentification ;
- les cas cliniques ;
- les contenus pédagogiques ;
- les appels API ;
- les éventuelles fonctionnalités d'assistance par intelligence artificielle ;
- le déploiement automatique en production.

L'application de production est accessible à l'adresse :

```text
https://e-radiologie.com
```

Le backend principal est exposé via :

```text
https://api.e-radiologie.com
```

---

## Fonctionnalités principales

Les routes actuellement exposées par l'application comprennent notamment :

### Pages publiques

- page d'accueil ;
- réinitialisation du mot de passe ;
- authentification utilisateur.

### Pages protégées

Les pages suivantes nécessitent une authentification valide :

- catalogue des cas cliniques ;
- détail d'un cas clinique ;
- tableau de bord ;
- profil utilisateur.

Le code source contient également différents modules et composants pédagogiques liés à l'imagerie médicale, dont l'activation peut dépendre de la version applicative et de la configuration du routage.

---

## Architecture générale

L'architecture de production est organisée de la manière suivante :

```text
Utilisateur
    │
    ▼
https://e-radiologie.com
    │
    │ Frontend React / Vite
    ▼
Nginx
    │
    ├── fichiers statiques du frontend
    │
    └── appels HTTP vers le backend
            │
            ▼
https://api.e-radiologie.com
```

Le frontend est compilé avec Vite puis servi directement par **Nginx**.

Aucun processus Node.js ou PM2 n'est nécessaire pour servir le frontend actuellement déployé en production.

---

## Technologies utilisées

Le projet utilise notamment :

- **React 19** ;
- **React DOM 19** ;
- **TypeScript** ;
- **Vite 6** ;
- **React Router DOM 7** ;
- **Tailwind CSS 4** ;
- **Lucide React** ;
- **Motion** ;
- **Express 4** pour le serveur Node présent dans le dépôt ;
- **Google GenAI SDK** pour certaines fonctionnalités d'assistance IA ;
- **dotenv** pour le chargement des variables d'environnement ;
- **esbuild** pour la compilation du serveur Node ;
- **npm** pour la gestion des dépendances ;
- **GitHub Actions** pour le déploiement automatique ;
- **Nginx** comme serveur web en production.

Les versions exactes sont définies dans :

```text
package.json
```

---

## Prérequis

Avant d'installer le projet, vérifier que les outils suivants sont disponibles.

### Node.js

Version recommandée :

```text
Node.js 22
```

Une version Node.js 20 ou supérieure devrait également être compatible avec la majorité des dépendances du projet.

Vérification :

```bash
node --version
npm --version
```

### Git

```bash
git --version
```

---

## Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/IssamLammri/e-radiologie-client.git
```

Puis entrer dans le dossier :

```bash
cd e-radiologie-client
```

---

### 2. Installer les dépendances

Pour une installation reproductible basée sur le fichier `package-lock.json` :

```bash
npm ci
```

Pour une installation classique :

```bash
npm install
```

En intégration continue et en production, `npm ci` est recommandé.

---

## Configuration de l'environnement

Un fichier d'exemple est disponible à la racine du projet :

```text
.env.example
```

Les principales variables prévues sont :

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
VITE_API_BASE_URL="http://api.e-radiologie.com"
```

### Configuration locale

Créer par exemple :

```bash
cp .env.example .env.local
```

Puis adapter les valeurs nécessaires.

### Configuration frontend de production

Pour le déploiement statique actuel, la variable essentielle est :

```env
VITE_API_BASE_URL=https://api.e-radiologie.com
```

Elle peut être définie dans :

```text
.env.production
```

ou injectée directement dans le workflow GitHub Actions pendant le build.

### Variables serveur optionnelles

Les variables suivantes concernent principalement `server.ts` :

```env
GEMINI_API_KEY=...
APP_URL=...
```

Elles ne doivent jamais être exposées dans le code frontend ni préfixées par `VITE_` si elles contiennent un secret.

---

## Sécurité des fichiers d'environnement

Les fichiers contenant des secrets ne doivent jamais être ajoutés au dépôt Git.

Le `.gitignore` du projet exclut notamment :

```text
.env*
```

avec une exception volontaire pour :

```text
.env.example
```

Ne jamais committer :

- une clé Gemini ;
- une clé SSH privée ;
- un token d'authentification ;
- un mot de passe ;
- des identifiants de production ;
- un secret GitHub Actions.

---

## Lancer le projet en développement

Le script de développement est :

```bash
npm run dev
```

Dans ce projet, `npm run dev` lance :

```text
tsx server.ts
```

Le serveur Express démarre sur le port :

```text
3000
```

En environnement de développement, Vite est chargé comme middleware par le serveur Express.

L'application est donc généralement accessible sur :

```text
http://localhost:3000
```

---

## Build de production

Pour générer le build :

```bash
npm run build
```

Le script exécute deux opérations :

1. compilation du frontend avec Vite ;
2. compilation de `server.ts` avec esbuild.

Le dossier généré ressemble à :

```text
dist/
├── assets/
├── index.html
├── server.cjs
└── server.cjs.map
```

### Production actuelle

La production actuelle utilise uniquement la partie frontend statique :

```text
index.html
assets/
```

Les fichiers suivants ne sont pas nécessaires au serveur Nginx statique :

```text
server.cjs
server.cjs.map
```

Ils sont exclus du déploiement automatique vers le répertoire web de production.

---

## Tester le build frontend

Pour prévisualiser le build Vite :

```bash
npm run preview
```

Vite indiquera l'URL locale utilisée pour la prévisualisation.

---

## Vérification TypeScript

Le projet fournit le script :

```bash
npm run lint
```

Il exécute actuellement :

```text
tsc --noEmit
```

Cette commande permet de vérifier le typage TypeScript sans générer de fichiers.

---

## Nettoyage

Pour supprimer les fichiers de build générés :

```bash
npm run clean
```

Le script supprime notamment :

```text
dist/
server.js
```

---

## Scripts npm

Les scripts actuellement définis dans `package.json` sont :

| Commande | Description |
|---|---|
| `npm run dev` | Lance `server.ts` avec `tsx` en développement |
| `npm run build` | Compile le frontend Vite et le serveur Node |
| `npm start` | Lance `dist/server.cjs` |
| `npm run preview` | Prévisualise le build Vite |
| `npm run clean` | Supprime les fichiers de build |
| `npm run lint` | Vérifie TypeScript avec `tsc --noEmit` |

---

## Structure du projet

Structure générale :

```text
.
├── .github/
│   └── workflows/
│       └── deploy-prod.yml
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── contrast/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── CaseDetail.tsx
│   │   ├── CasesCatalog.tsx
│   │   ├── Classifications.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   ├── RadioAnatomy.tsx
│   │   ├── Reports.tsx
│   │   ├── ResetPassword.tsx
│   │   └── SubmitCase.tsx
│   │
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

> La présence d'une page ou d'un composant dans `src/` ne signifie pas nécessairement qu'il est actuellement exposé dans le routage de production.

---

## `src/components`

Contient les composants React réutilisables de l'application.

Exemples :

```text
src/components/auth/
src/components/layout/
src/components/ui/
src/components/contrast/
```

---

## `src/contexts`

Contient les contextes React partagés.

Le contexte d'authentification est situé dans :

```text
src/contexts/AuthContext.tsx
```

Il gère notamment :

- l'utilisateur courant ;
- le token d'authentification ;
- l'état connecté / déconnecté ;
- l'ouverture de la modale d'authentification ;
- la récupération du profil utilisateur.

Le token est actuellement stocké dans :

```text
localStorage
```

sous la clé :

```text
auth_token
```

---

## `src/pages`

Contient les pages et modules fonctionnels principaux de l'application.

Le routage actif est défini dans :

```text
src/App.tsx
```

Les routes protégées passent par un composant :

```text
ProtectedRoute
```

qui redirige l'utilisateur non authentifié vers la page d'accueil.

---

## `src/types`

Contient les interfaces et types TypeScript partagés dans l'application.

---

## `server.ts`

Le dépôt contient également un serveur Express dans :

```text
server.ts
```

Ce serveur :

- charge les variables d'environnement avec `dotenv` ;
- expose certaines routes serveur ;
- peut appeler Google Gemini ;
- fournit des mécanismes de fallback locaux ;
- sert Vite en mode développement ;
- peut servir le dossier `dist/` lorsqu'il est lancé en mode production Node.

Il écoute actuellement sur :

```text
0.0.0.0:3000
```

---

## API backend principale

Le frontend communique avec le backend métier via :

```env
VITE_API_BASE_URL=https://api.e-radiologie.com
```

Exemples d'appels :

```text
GET /api/auth/me
GET /api/cases/{slug}
```

Le frontend ne doit pas contenir d'URL de production en dur lorsqu'une variable d'environnement peut être utilisée.

---

## Authentification

Après authentification, le frontend conserve le token dans le navigateur.

Le token est transmis au backend sous la forme :

```http
Authorization: Bearer <TOKEN>
```

L'endpoint utilisateur est notamment :

```text
/api/auth/me
```

En cas de token invalide, l'application déconnecte l'utilisateur localement.

---

## Fonctionnalités IA du serveur Node

`server.ts` contient actuellement des routes liées à l'assistance pédagogique, notamment :

```text
POST /api/evaluate-case-draft
POST /api/grade-anatomy
```

Ces routes peuvent utiliser Google Gemini et disposent de mécanismes de fallback locaux.

### Attention avec le déploiement statique

La production actuelle de `e-radiologie.com` est servie directement par Nginx.

Par conséquent, **`server.ts` n'est pas exécuté en production dans cette architecture**.

Une fonctionnalité frontend qui appelle directement :

```text
/api/grade-anatomy
```

sur `e-radiologie.com` nécessitera donc soit :

- de déplacer cet endpoint vers `api.e-radiologie.com` ;
- de modifier le frontend pour utiliser le backend principal ;
- ou de mettre en place séparément le serveur Node.

L'architecture recommandée est de centraliser les API métier et IA côté backend afin de conserver un frontend statique simple à déployer.

---

# Déploiement en production

## Principe

Le frontend de production est servi directement par Nginx.

Répertoire de production :

```text
/var/www/e-radiologie.com
```

Domaine :

```text
https://e-radiologie.com
```

Le déploiement ne nécessite pas :

- PM2 ;
- un processus Node permanent ;
- un redémarrage de l'application Node ;
- une recréation du certificat SSL à chaque mise à jour.

---

## Déploiement automatique avec GitHub Actions

Le workflow de production est placé dans :

```text
.github/workflows/deploy-prod.yml
```

Le principe est :

```text
Push sur main
      │
      ▼
GitHub Actions
      │
      ├── Checkout
      ├── Node.js 22
      ├── npm ci
      ├── npm run build
      ├── connexion SSH au VPS
      ├── transfert du build
      └── publication dans /var/www/e-radiologie.com
      │
      ▼
https://e-radiologie.com
```

Le déploiement est déclenché automatiquement lors d'un :

```bash
git push origin main
```

---

## Secrets GitHub Actions requis

Dans :

```text
GitHub
→ Repository
→ Settings
→ Secrets and variables
→ Actions
→ Repository secrets
```

les secrets suivants doivent exister :

### `VPS_HOST`

Adresse IP ou nom d'hôte du VPS.

```text
VPS_HOST
```

### `VPS_USER`

Utilisateur SSH utilisé pour le déploiement.

Dans l'infrastructure actuelle :

```text
ubuntu
```

### `VPS_SSH_KEY`

Clé SSH privée permettant à GitHub Actions de se connecter au VPS.

La clé privée ne doit jamais être ajoutée :

- au dépôt ;
- au README ;
- à un commit ;
- à un ticket ;
- aux logs ;
- à une conversation ou documentation publique.

---

## Clé SSH de déploiement

Une clé dédiée au déploiement E-radiologie peut être utilisée côté serveur.

Exemple de nom :

```text
~/.ssh/github_actions_e_radiologie
```

La clé publique correspondante doit être présente dans :

```text
~/.ssh/authorized_keys
```

Seule la **clé privée** correspondante est enregistrée dans le secret GitHub :

```text
VPS_SSH_KEY
```

---

## Build dans GitHub Actions

La variable backend doit être injectée au moment du build :

```yaml
env:
  VITE_API_BASE_URL: https://api.e-radiologie.com
```

Puis :

```yaml
run: npm run build
```

Les variables préfixées par `VITE_` sont intégrées au bundle frontend pendant la compilation.

Toute modification de `VITE_API_BASE_URL` nécessite donc un nouveau build.

---

## Publication du build

Le workflow transfère le contenu utile de :

```text
dist/
```

vers :

```text
/var/www/e-radiologie.com/
```

Les fichiers serveur suivants doivent être exclus du site web statique :

```text
server.cjs
server.cjs.map
```

Le fichier `.map` ne doit notamment pas être exposé publiquement sans besoin explicite.

---

## Nginx

Le domaine `e-radiologie.com` est servi par Nginx.

Le principe de configuration du frontend est :

```nginx
root /var/www/e-radiologie.com;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}
```

Le fallback :

```nginx
/index.html
```

est indispensable pour les routes gérées côté client avec React Router.

Sans cette règle, l'accès direct à une URL telle que :

```text
https://e-radiologie.com/cases
```

pourrait générer une erreur `404` Nginx.

---

## SSL / HTTPS

Le certificat HTTPS est géré par Let's Encrypt / Certbot sur le serveur.

Une fois le certificat installé, un déploiement frontend classique ne nécessite aucune nouvelle exécution de Certbot.

Toujours vérifier que les appels frontend utilisent également HTTPS :

```text
https://api.e-radiologie.com
```

et non :

```text
http://api.e-radiologie.com
```

afin d'éviter les erreurs de contenu mixte dans le navigateur.

---

## Déploiement manuel de secours

En cas de problème avec GitHub Actions, un déploiement manuel peut être réalisé.

### 1. Récupérer la dernière version

```bash
cd ~/projets/e-radiologie-client
git pull origin main
```

### 2. Installer les dépendances

```bash
npm ci
```

### 3. Configurer le backend

```bash
echo 'VITE_API_BASE_URL=https://api.e-radiologie.com' > .env.production
```

### 4. Compiler

```bash
npm run build
```

### 5. Publier

```bash
sudo mkdir -p /var/www/e-radiologie.com
sudo rsync -a --delete \
  --exclude='server.cjs' \
  --exclude='server.cjs.map' \
  dist/ \
  /var/www/e-radiologie.com/
```

### 6. Corriger les permissions

```bash
sudo chown -R www-data:www-data /var/www/e-radiologie.com
sudo find /var/www/e-radiologie.com -type d -exec chmod 755 {} \;
sudo find /var/www/e-radiologie.com -type f -exec chmod 644 {} \;
```

Aucun rechargement Nginx n'est normalement nécessaire lorsque seuls les fichiers statiques changent.

---

## Vérification après déploiement

Tester la page principale :

```bash
curl -I https://e-radiologie.com
```

Tester une route React :

```bash
curl -I https://e-radiologie.com/cases
```

Réponse attendue :

```text
HTTP 200
```

Tester également depuis un navigateur :

```text
https://e-radiologie.com
```

---

## Rollback manuel

Avant une modification importante de l'infrastructure ou du serveur web, conserver une sauvegarde de la configuration concernée.

Exemple pour Nginx :

```bash
sudo cp /etc/nginx/sites-available/e-radiologie.com \
  /etc/nginx/sites-available/e-radiologie.com.backup
```

Avant de recharger Nginx après une modification de configuration :

```bash
sudo nginx -t
```

Puis uniquement si le test est valide :

```bash
sudo systemctl reload nginx
```

---

## Bonnes pratiques Git

Avant de pousser sur `main` :

1. vérifier que l'application démarre ;
2. vérifier les erreurs TypeScript ;
3. vérifier le build ;
4. vérifier qu'aucun secret n'a été ajouté ;
5. utiliser un message de commit explicite.

Exemples :

```bash
git commit -m "feat: ajout du catalogue de cas cliniques"
```

```bash
git commit -m "fix: correction de l'authentification utilisateur"
```

```bash
git commit -m "refactor: amélioration des appels API"
```

```bash
git commit -m "deploy: mise à jour du workflow de production"
```

---

## Workflow recommandé avant push

```bash
npm ci
npm run lint
npm run build
```

Puis :

```bash
git status
git add .
git commit -m "feat: description de la modification"
git push origin main
```

Le push sur `main` déclenche ensuite automatiquement le déploiement de production via GitHub Actions.

---

## Sécurité

Les informations suivantes ne doivent jamais être enregistrées directement dans le code source :

- mots de passe ;
- clés API ;
- tokens d'accès ;
- clés SSH privées ;
- identifiants de bases de données ;
- secrets d'authentification ;
- secrets GitHub Actions ;
- informations confidentielles de production.

Utiliser :

- les variables d'environnement pour la configuration applicative ;
- les GitHub Secrets pour les informations sensibles utilisées par GitHub Actions ;
- les permissions système adaptées sur le VPS.

---

## Sécurité des clés SSH

Une clé privée doit toujours conserver des permissions restrictives :

```bash
chmod 600 ~/.ssh/id_ed25519
```

Le répertoire SSH doit généralement utiliser :

```bash
chmod 700 ~/.ssh
```

La clé publique peut être présente dans :

```text
~/.ssh/authorized_keys
```

mais la clé privée ne doit jamais être publiée.

---

## Gestion des dépendances

Pour mettre à jour les dépendances :

```bash
npm outdated
```

Puis effectuer les mises à jour de manière contrôlée.

Après toute modification importante :

```bash
npm ci
npm run lint
npm run build
```

Éviter de supprimer ou régénérer `package-lock.json` sans nécessité.

---

## API et CORS

Le frontend et le backend utilisent actuellement deux domaines distincts :

```text
Frontend : https://e-radiologie.com
Backend  : https://api.e-radiologie.com
```

Le backend doit donc autoriser correctement l'origine frontend dans sa configuration CORS.

Origine de production :

```text
https://e-radiologie.com
```

---

## React Router et accès direct aux URLs

L'application utilise `BrowserRouter`.

Nginx doit donc toujours rediriger les routes frontend inconnues vers :

```text
/index.html
```

Exemple :

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Cette règle permet de rafraîchir directement des pages telles que :

```text
/cases
/cases/:id
/dashboard
/profile
/reset-password
```

sans générer de `404` serveur.

---

## Logs et diagnostic

### Vérifier Nginx

```bash
sudo nginx -t
```

### État du service

```bash
sudo systemctl status nginx
```

### Logs d'erreur

```bash
sudo tail -f /var/log/nginx/error.log
```

### Logs d'accès

```bash
sudo tail -f /var/log/nginx/access.log
```

### Tester le backend

```bash
curl -I https://api.e-radiologie.com
```

### Vérifier le contenu publié

```bash
ls -la /var/www/e-radiologie.com
```

---

## GitHub Actions : diagnostic

En cas d'échec du déploiement :

1. ouvrir le dépôt GitHub ;
2. ouvrir l'onglet **Actions** ;
3. sélectionner le workflow **Deploy e-radiologie client** ;
4. ouvrir l'exécution en erreur ;
5. identifier l'étape ayant échoué.

Points à vérifier en priorité :

- `npm ci` ;
- `npm run build` ;
- présence de `VPS_HOST` ;
- présence de `VPS_USER` ;
- présence de `VPS_SSH_KEY` ;
- accès SSH au VPS ;
- droits `sudo` de l'utilisateur de déploiement ;
- permissions sur `/var/www/e-radiologie.com`.

Ne jamais afficher volontairement `VPS_SSH_KEY` dans les logs d'une Action.

---

## Environnements

### Développement

```text
http://localhost:3000
```

### Production

```text
https://e-radiologie.com
```

### API production

```text
https://api.e-radiologie.com
```

---

## Maintenance

Toute évolution importante concernant :

- l'architecture ;
- les dépendances ;
- les variables d'environnement ;
- l'authentification ;
- les routes API ;
- le workflow GitHub Actions ;
- la procédure d'installation ;
- la procédure de déploiement ;
- la configuration Nginx ;
- les prérequis techniques

doit être documentée dans ce fichier afin de conserver une procédure fiable et reproductible.

---

## Points d'attention actuels

### 1. Backend HTTPS

Toujours utiliser :

```text
https://api.e-radiologie.com
```

pour la production.

### 2. Endpoints présents dans `server.ts`

Le serveur Node n'étant pas lancé dans l'architecture statique actuelle, ses endpoints doivent être migrés vers le backend principal s'ils doivent être utilisés en production.

### 3. Variables Vite

Les variables `VITE_*` sont injectées à la compilation et sont visibles côté navigateur.

Ne jamais y stocker un secret.

### 4. Source maps serveur

`server.cjs.map` ne doit pas être déployé dans le répertoire web public sans nécessité explicite.

---

## Accès au projet

L'accès au dépôt ne constitue pas une autorisation permettant :

- de copier le projet ;
- de redistribuer son code source ;
- de publier une copie du projet ;
- de vendre ou commercialiser tout ou partie du projet ;
- de créer une version dérivée sans autorisation ;
- de réutiliser le code dans un autre produit sans autorisation.

Toute utilisation doit respecter les droits du propriétaire ainsi que les licences applicables aux dépendances et aux éventuels fichiers tiers intégrés au projet.

---

## Licence

**Code propriétaire — Tous droits réservés, sauf mentions de licence contraires explicitement présentes dans certains fichiers ou composants tiers.**

Copyright © 2026 **Issam LAMMRI**

Le projet utilise des bibliothèques open source soumises à leurs propres licences.

Certaines sources peuvent également comporter une mention SPDX ou une licence spécifique. Ces mentions restent applicables aux fichiers concernés et doivent être conservées conformément à leurs conditions.

Pour le code propriétaire du projet, toute copie, reproduction, publication, distribution, sous-licence, commercialisation ou réutilisation sans autorisation préalable est interdite.

---

## Auteur

### Développement

**Issam LAMMRI**  
**Développeur & Lead Developer**

Responsable du développement et de l'architecture technique du projet.

---

**E-radiologie Client — Copyright © 2026 Issam LAMMRI — Tous droits réservés.**