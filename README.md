# 🛒 VenteApp — Système Professionnel de Gestion des Ventes

> Stack : **Spring Boot 3.2** (Java 17) + **Angular 17** (Standalone Components)

---

## 📐 Architecture du projet

```
venteapp/
├── backend/                         # Spring Boot
│   └── src/main/java/com/venteapp/
│       ├── config/
│       │   ├── SecurityConfig.java  # JWT + CORS + Spring Security
│       │   └── DataInitializer.java # Données de démo
│       ├── controller/
│       │   ├── Controllers.java     # Auth, Produit, Client, Vente, Dashboard
│       │   └── CategorieController.java
│       ├── dto/
│       │   ├── AuthDTOs.java        # Login/Register/Refresh/Response
│       │   └── BusinessDTOs.java    # Produit, Client, Vente, Dashboard DTOs
│       ├── entity/
│       │   ├── User.java            # Utilisateurs (ADMIN/MANAGER/VENDEUR)
│       │   ├── Produit.java         # Catalogue produits
│       │   ├── Client.java          # Base clients
│       │   ├── Vente.java           # En-tête vente
│       │   ├── LigneVente.java      # Lignes de vente
│       │   └── Categorie.java       # Catégories produits
│       ├── exception/
│       │   ├── BusinessException.java
│       │   └── GlobalExceptionHandler.java
│       ├── repository/              # Spring Data JPA
│       ├── security/
│       │   ├── JwtUtils.java        # Génération/validation JWT
│       │   └── JwtAuthFilter.java   # Filtre Bearer token
│       └── service/
│           ├── AuthService.java
│           ├── ProduitService.java
│           ├── ClientService.java
│           ├── VenteService.java
│           └── DashboardService.java
│
└── frontend/                        # Angular 17
    └── src/app/
        ├── core/
        │   ├── models/models.ts     # Interfaces TypeScript
        │   ├── services/
        │   │   ├── auth.service.ts  # Auth + Signal currentUser
        │   │   └── api.services.ts  # Produit/Client/Vente/Dashboard services
        │   ├── guards/auth.guard.ts # Route guards
        │   └── interceptors/
        │       └── jwt.interceptor.ts  # Auto-attach Bearer token
        ├── features/
        │   ├── auth/
        │   │   ├── login.component.ts
        │   │   └── register.component.ts
        │   ├── dashboard/dashboard.component.ts
        │   ├── produits/produits.component.ts
        │   ├── clients/clients.component.ts
        │   └── ventes/ventes.component.ts
        └── shared/
            └── components/shell.component.ts  # Layout sidebar
```

---

## 🚀 Démarrage rapide

### Backend (Spring Boot)

```bash
cd venteapp/backend
mvn spring-boot:run
# Démarrage sur → http://localhost:8080
# Console H2   → http://localhost:8080/h2-console
```

### Frontend (Angular)

```bash
cd venteapp/frontend
npm install
ng serve
# Application → http://localhost:4200
```

---

## 🔐 Comptes de démonstration

| Utilisateur | Mot de passe | Rôle      |
|-------------|--------------|-----------|
| admin       | Admin123!    | ADMIN     |
| manager     | Manager123!  | MANAGER   |
| vendeur     | Vendeur123!  | VENDEUR   |

---

## 🔒 Sécurité

| Mécanisme            | Détail                                         |
|----------------------|------------------------------------------------|
| Authentification     | JWT (Access Token 24h + Refresh Token 7j)      |
| Chiffrement mdp      | BCrypt strength=12                             |
| Autorisation         | Role-based (ADMIN / MANAGER / VENDEUR)         |
| CORS                 | Restreint à http://localhost:4200              |
| Session              | Stateless (STATELESS SessionCreationPolicy)    |
| Token transport      | Authorization: Bearer `<token>`               |
| Méthode annotation   | @PreAuthorize sur endpoints sensibles          |

---

## 📡 API REST — Endpoints

### Auth `/api/auth`
| Méthode | Endpoint        | Description              |
|---------|-----------------|--------------------------|
| POST    | /login          | Connexion                |
| POST    | /register       | Inscription              |
| POST    | /refresh        | Rafraîchir le token      |

### Produits `/api/produits` *(authentifié)*
| Méthode | Endpoint         | Description              |
|---------|------------------|--------------------------|
| GET     | /               | Liste tous les produits  |
| GET     | /actifs          | Produits actifs seulement|
| GET     | /{id}            | Détail produit           |
| POST    | /               | Créer un produit         |
| PUT     | /{id}            | Modifier un produit      |
| DELETE  | /{id}            | Désactiver               |
| GET     | /stock-faible    | Produits en alerte stock |

### Clients `/api/clients` *(authentifié)*
| Méthode | Endpoint         | Description              |
|---------|------------------|--------------------------|
| GET     | /               | Liste tous les clients   |
| GET     | /{id}            | Détail client            |
| GET     | /search?q=...    | Recherche                |
| POST    | /               | Créer un client          |
| PUT     | /{id}            | Modifier                 |
| DELETE  | /{id}            | Désactiver               |

### Ventes `/api/ventes` *(authentifié)*
| Méthode | Endpoint                  | Description              |
|---------|---------------------------|--------------------------|
| GET     | /                        | Liste des ventes         |
| GET     | /{id}                    | Détail vente             |
| POST    | /                        | Créer une vente          |
| PATCH   | /{id}/statut?statut=...  | Changer le statut        |
| DELETE  | /{id}                    | Annuler                  |

### Dashboard `/api/dashboard` *(authentifié)*
| Méthode | Endpoint | Description         |
|---------|----------|---------------------|
| GET     | /        | Statistiques temps réel |

---

## ✅ Fonctionnalités implémentées

- [x] **Authentification JWT** — login, register, refresh token, logout
- [x] **CRUD Produits** — création, modification, suppression douce, alerte stock faible
- [x] **CRUD Clients** — fiche client complète avec historique achats
- [x] **CRUD Ventes** — création multi-lignes, calcul TVA/remise automatique, workflow statuts
- [x] **Tableau de bord** — KPIs temps réel + graphique ventes par mois
- [x] **Gestion des stocks** — décrémentation automatique à la vente, restitution si annulation
- [x] **Catégories produits** — CRUD complet
- [x] **Rôles** — ADMIN / MANAGER / VENDEUR avec contrôle d'accès
- [x] **Données de démo** — 8 produits, 5 clients, 3 utilisateurs injectés au démarrage

---

## 🔄 Workflow des ventes

```
EN_ATTENTE → CONFIRMEE → PAYEE → LIVREE
     ↓
  ANNULEE  (stock restitué automatiquement)
```

---

## 🗄️ Base de données

Par défaut : **H2 en mémoire** (développement).
Pour passer à **MySQL** :

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/venteapp
spring.datasource.username=root
spring.datasource.password=votremdp
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

Et décommenter la dépendance MySQL dans `pom.xml`.

---

## 📦 Technologies

| Côté        | Technologie               | Version |
|-------------|---------------------------|---------|
| Backend     | Spring Boot               | 3.2.x   |
| Backend     | Spring Security + JWT     | 6.x     |
| Backend     | Spring Data JPA           | 3.2.x   |
| Backend     | H2 / MySQL                | —       |
| Backend     | Lombok                    | 1.18.x  |
| Frontend    | Angular                   | 17.x    |
| Frontend    | Angular Signals           | 17.x    |
| Frontend    | SCSS custom design system | —       |
| Sécurité    | JJWT                      | 0.12.3  |
| Build       | Maven + Angular CLI       | —       |
#   V e n t e A p p  
 