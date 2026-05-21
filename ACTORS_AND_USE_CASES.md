# 👥 VenteApp - Actors & Use Cases

## Overview
**VenteApp** has **3 actors** (user roles) with different responsibilities in the sales management system.

---

## 📊 Actors Summary

| Actor | Role Name | Full Name | Password | Responsibilities |
|-------|-----------|-----------|----------|------------------|
| **Admin** | ROLE_ADMIN | Administrateur Système | Admin123! | System management, configuration |
| **Manager** | ROLE_MANAGER | Chef des Ventes | Manager123! | Sales oversight, reporting |
| **Salesperson** | ROLE_VENDEUR | Ahmed Ben Salah | Vendeur123! | Daily sales operations |

---

## 🎯 Actor 1: ADMIN (Administrateur Système)

### Who?
- **System Administrator**
- Full name: "Administrateur Système"
- Username: `admin`
- Password: `Admin123!`

### Responsibilities
Manages the entire system, configuration, and user management.

### Use Cases

#### 🔐 Authentication
- **UC1.1: Login**
  - Admin logs in with username and password
  - Receives JWT access token (24h) + refresh token (7d)
  - Token stored in localStorage
  
- **UC1.2: Logout**
  - Admin ends session
  - Tokens cleared, session terminated

#### 👤 User Management *(Future Extension)*
- **UC2.1: Create Users**
  - Create new manager or salesperson accounts
  - Assign roles (ROLE_MANAGER, ROLE_VENDEUR)
  - Set password, email, full name
  - *Note: Currently only via data initializer*

- **UC2.2: Manage User Permissions**
  - Enable/disable user accounts
  - Access endpoint: `/api/admin/**` (only admin can access)
  - Monitor system access

#### 📦 Manage Product Catalog
- **UC3.1: Full CRUD on Products**
  - Create new products with:
    - Name, reference code
    - Price (selling), cost price
    - Stock level, minimum stock alert
    - Category assignment
    - Active/Inactive status
  - Read all products (active & inactive)
  - Update product information
  - Soft delete products
  
- **UC3.2: Manage Categories**
  - Create product categories (Électronique, Informatique, Bureau, Mobilier)
  - Update category names & descriptions
  - Delete categories
  - View product count per category

- **UC3.3: Monitor Stock Levels**
  - View all products
  - Get low-stock alerts (`/api/produits/stock-faible`)
  - Track stock changes from sales

#### 👥 Manage Client Database
- **UC4.1: Full Client Management**
  - Create new clients with:
    - Name, first name
    - Email, phone number
    - City, country
    - Active/Inactive status
  - View all clients
  - Update client information
  - Soft delete clients
  - Search clients by name/email

#### 💰 Manage Sales & Orders
- **UC5.1: Create Sales Orders**
  - Create new sale with:
    - Client selection
    - Multiple line items (products, quantities, prices)
    - Automatic VAT calculation
    - Discount application
    - Total amount calculation
  - Automatic stock deduction
  
- **UC5.2: Manage Sale Status Workflow**
  - Update sale status:
    - EN_ATTENTE → CONFIRMEE → PAYEE → LIVREE
    - Can cancel (ANNULEE) - stock automatically restored
  - View all sales history
  - View individual sale details with line items

#### 📊 Dashboard & Analytics
- **UC6.1: View System Dashboard**
  - See real-time KPIs:
    - Total sales amount
    - Number of clients
    - Number of products
    - Number of active sales
  - View monthly sales chart
  - Monitor business metrics
  - Access via `/api/dashboard`

### Access Level
✅ **Full system access** - Can access all endpoints except those restricted to specific roles
- ✓ `/api/auth/**` - Authentication
- ✓ `/api/produits/**` - Products management
- ✓ `/api/clients/**` - Clients management
- ✓ `/api/ventes/**` - Sales management
- ✓ `/api/dashboard/**` - Dashboard
- ✓ `/api/categories/**` - Categories management
- ✓ `/api/admin/**` - Admin-only endpoints

---

## 🎯 Actor 2: MANAGER (Chef des Ventes / Sales Manager)

### Who?
- **Sales Manager / Sales Supervisor**
- Full name: "Chef des Ventes"
- Username: `manager`
- Password: `Manager123!`

### Responsibilities
Oversees sales team operations, monitors performance, approves sales.

### Use Cases

#### 🔐 Authentication
- **UC1.1: Login**
  - Manager logs in with username and password
  - Receives JWT access token (24h) + refresh token (7d)
  
- **UC1.2: Logout**
  - Manager ends session
  - Tokens cleared

#### 📦 View Product Catalog
- **UC3.1: Read Products**
  - View all products with stock levels
  - View only active products (`/api/produits/actifs`)
  - Get low-stock alerts
  - *Cannot create/modify/delete (use case not implemented)*

#### 👥 View & Manage Clients
- **UC4.1: Manage Clients**
  - View all clients
  - Create new clients
  - Update client information
  - Search clients by name/email
  - Soft delete inactive clients

#### 💰 Manage Sales Operations
- **UC5.1: Create & Monitor Sales**
  - Create sales orders (same as admin)
  - View all sales (full history)
  - View individual sale details
  - Update sale status (workflow management)
  - Cancel sales if needed
  - Monitor sales team performance

#### 📊 View Dashboard & Reports
- **UC6.1: Access Sales Dashboard**
  - View real-time KPIs
  - Monitor monthly sales metrics
  - Track business performance
  - Monitor team sales
  - Generate insights for decision-making

### Typical Workflow
```
1. Review yesterday's sales on dashboard
2. Check for low stock items
3. Monitor active sales (waiting for payment/delivery)
4. Approve new clients from sales team
5. Update sale statuses (confirm, mark as paid, etc.)
6. Generate performance reports
```

### Access Level
✅ **Full read access** + **write access to sales & clients**
- ✓ `/api/auth/**` - Authentication
- ✓ `/api/produits/**` - Read products
- ✓ `/api/clients/**` - Full client management
- ✓ `/api/ventes/**` - Full sales management
- ✓ `/api/dashboard/**` - Dashboard
- ✗ `/api/admin/**` - Cannot access (admin only)

---

## 🎯 Actor 3: VENDEUR (Salesperson / Sales Rep)

### Who?
- **Sales Representative / Salesperson**
- Full name: "Ahmed Ben Salah" (demo account)
- Username: `vendeur`
- Password: `Vendeur123!`

### Responsibilities
Executes daily sales operations, creates orders, serves clients.

### Use Cases

#### 🔐 Authentication
- **UC1.1: Login**
  - Salesperson logs in
  - Receives JWT access token (24h) + refresh token (7d)
  
- **UC1.2: Logout**
  - Salesperson ends session

#### 📦 Browse Product Catalog
- **UC3.1: View Products**
  - View all products in catalog
  - View only active products
  - Check stock levels and availability
  - Get low-stock alerts
  - Check prices and product details
  - *Cannot modify products (admin responsibility)*

#### 👥 View Clients
- **UC4.1: Manage Clients**
  - View all existing clients
  - Create new client records when acquiring new customers
  - Update client contact information
  - Search clients by name
  - View client history

#### 💰 Create & Track Sales
- **UC5.1: Create Sales Orders** *(Primary Use Case)*
  - Create new sale:
    - Select existing client or create new
    - Add multiple line items:
      - Select product
      - Enter quantity
      - System calculates line total
    - Apply discounts if authorized
    - System auto-calculates VAT (20%)
    - Confirm and submit order
  - Stock automatically decremented
  - Sale status: EN_ATTENTE (pending)

- **UC5.2: Track Own Sales**
  - View all sales created
  - View sale details
  - Track sale status changes
  - View order line items
  - Monitor pending payments
  - *Cannot cancel sales without manager approval*

#### 📊 View Dashboard
- **UC6.1: Access Personal Dashboard**
  - View overall business KPIs
  - Monitor sales metrics
  - See monthly sales trends
  - Track own sales performance
  - *Dashboard shows system-wide data (same as manager)*

### Typical Daily Workflow
```
1. Login to system
2. Review product catalog
3. Search for client information
4. Create new sales order:
   - Customer: "Trabelsi Mohamed"
   - Item 1: Ordinateur Portable (1x) = 2499.99
   - Item 2: Clavier Mécanique (2x) = 159.99 each
   - Subtotal: 2819.97
   - VAT (20%): 563.99
   - Total: 3383.96
5. Submit order
6. Monitor order status for payment
7. Logout
```

### Access Level
✅ **Read-heavy access** + **write access to sales & clients**
- ✓ `/api/auth/**` - Authentication
- ✓ `/api/produits/**` - View all products
- ✓ `/api/clients/**` - Full client management
- ✓ `/api/ventes/**` - Full sales management
- ✓ `/api/dashboard/**` - Dashboard (read-only)
- ✗ `/api/admin/**` - Cannot access (admin only)

---

## 🔄 Common Features for All Actors

### Available to All Authenticated Users

#### Frontend Pages
All logged-in users can access:
- **Dashboard** - System-wide KPIs and charts
- **Produits (Products)** - View product catalog
- **Clients** - Manage client database
- **Ventes (Sales)** - View and manage sales

#### API Endpoints (Protected)
All authenticated users can access:
```
GET    /api/produits              - List all products
GET    /api/produits/actifs       - Active products only
GET    /api/produits/{id}         - Product details
GET    /api/produits/stock-faible - Low stock items
POST   /api/produits              - Create product
PUT    /api/produits/{id}         - Update product
DELETE /api/produits/{id}         - Delete product

GET    /api/clients               - List clients
GET    /api/clients/{id}          - Client details
GET    /api/clients/search?q=...  - Search clients
POST   /api/clients               - Create client
PUT    /api/clients/{id}          - Update client
DELETE /api/clients/{id}          - Delete client

GET    /api/ventes                - List sales
GET    /api/ventes/{id}           - Sale details
POST   /api/ventes                - Create sale
PATCH  /api/ventes/{id}/statut    - Update status
DELETE /api/ventes/{id}           - Cancel sale

GET    /api/dashboard             - Dashboard data
GET    /api/categories            - Product categories
```

---

## 🔒 Access Control Matrix

| Feature | Admin | Manager | Vendeur |
|---------|:-----:|:-------:|:-------:|
| **User Management** | ✅ | ❌ | ❌ |
| **Create Products** | ✅ | ❌ | ❌ |
| **Read Products** | ✅ | ✅ | ✅ |
| **Update Products** | ✅ | ❌ | ❌ |
| **Delete Products** | ✅ | ❌ | ❌ |
| **Create Clients** | ✅ | ✅ | ✅ |
| **Read Clients** | ✅ | ✅ | ✅ |
| **Update Clients** | ✅ | ✅ | ✅ |
| **Delete Clients** | ✅ | ✅ | ✅ |
| **Create Sales** | ✅ | ✅ | ✅ |
| **Read Sales** | ✅ | ✅ | ✅ |
| **Update Sale Status** | ✅ | ✅ | ✅ |
| **Cancel Sales** | ✅ | ✅ | ✅ |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **Admin Endpoints** | ✅ | ❌ | ❌ |

*Note: Current implementation provides same read/write access to all authenticated users for business operations. Role differentiation is more procedural/organizational than technical.*

---

## 🔐 Security Features

### Authentication
- **JWT-based** (JSON Web Tokens)
- **Access Token**: 24 hours validity
- **Refresh Token**: 7 days validity
- **Token Storage**: Browser localStorage
- **Token Transport**: `Authorization: Bearer <token>` header

### Password Security
- **Encryption**: BCrypt with strength 12
- **Not stored as plain text**
- Can be reset via password reset functionality

### Session Management
- **Stateless** - No server-side session storage
- Each request carries JWT token
- Token verified on backend

### CORS (Cross-Origin Resource Sharing)
- Restricted to `http://localhost:4200` (frontend)
- Also allows `http://localhost:52638` (dev server)
- Prevents unauthorized cross-origin requests

---

## 📋 Data Initialization (Demo Data)

### Pre-loaded Users
```
Username: admin    | Password: Admin123!  | Role: ADMIN
Username: manager  | Password: Manager123!| Role: MANAGER  
Username: vendeur  | Password: Vendeur123!| Role: VENDEUR
```

### Demo Products (8 items)
- Ordinateur Portable Dell XPS 15 - 2499.99€
- iPhone 15 Pro 256GB - 1599.00€
- Écran Samsung 27" 4K - 649.99€
- Clavier Mécanique Logitech - 159.99€
- Chaise de Bureau Ergonomique - 799.00€
- Imprimante HP LaserJet Pro - 449.00€
- Casque Sony WH-1000XM5 - 379.00€
- Tablette iPad Air 5e Génération - 849.00€

### Demo Clients (5 contacts)
- Trabelsi Mohamed (Tunis)
- Belhassen Sana (Sfax)
- Chaabane Karim (Sousse)
- Mansouri Leila (Bizerte)
- Hammami Yassine (Tunis)

### Product Categories (4)
- Électronique
- Informatique
- Bureau
- Mobilier

---

## 🎬 Example Scenarios

### Scenario 1: New Salesperson Makes a Sale
```
Actor: VENDEUR (Ahmed)
1. Login (vendeur / Vendeur123!)
2. View Products → Find "Ordinateur Portable Dell XPS 15"
3. View Clients → Search "Trabelsi"
4. Create Sale:
   - Client: Trabelsi Mohamed
   - Line 1: Ordinateur (1x @ 2499.99€)
   - Line 2: Clavier Mécanique (1x @ 159.99€)
   - Subtotal: 2659.98€
   - VAT (20%): 531.99€
   - Total: 3191.97€
5. Submit → Sale status: EN_ATTENTE
6. Stock decremented: Dell -1, Keyboard -1
```

### Scenario 2: Manager Reviews Daily Sales
```
Actor: MANAGER (Chef des Ventes)
1. Login (manager / Manager123!)
2. View Dashboard:
   - Total sales today: €15,432.45
   - Active clients: 5
   - Products in stock: 8
   - Pending payments: 3 sales
3. Check low-stock alerts:
   - Imprimante HP LaserJet Pro (stock: 2, min: 3) ⚠️
   - Clavier Mécanique (stock: 3, min: 5) ⚠️
4. Review pending sales:
   - Sales EN_ATTENTE (awaiting confirmation)
   - Sales CONFIRMEE (awaiting payment)
5. Create new client for sales team
6. Approve sale status updates
7. Monitor monthly trends
```

### Scenario 3: Admin System Maintenance
```
Actor: ADMIN
1. Login (admin / Admin123!)
2. Review dashboard
3. Manage product catalog:
   - Add new product: "Webcam Logitech 4K" to Électronique
   - Update prices on existing products
   - Mark slow-moving items as inactive
4. Monitor system health:
   - Check user activity
   - Review low stock alerts
5. Access admin-only endpoints
6. Manage user accounts if needed
```

---

## 📝 Notes

### Current Implementation
- **Role-Based Access Control (RBAC)** is partially implemented
- Admin endpoints (`/api/admin/**`) are restricted to ROLE_ADMIN
- Other endpoints are accessible to all authenticated users
- Frontend shows same UI/pages for all roles

### Future Enhancement Opportunities
1. **Manager-Only Dashboard**: Advanced analytics, sales team performance
2. **Salesperson Dashboard**: Personal sales targets, commission tracking
3. **Permission-Based UI**: Hide create/edit/delete buttons based on role
4. **Audit Trail**: Track who created/modified sales and products
5. **Approval Workflows**: Manager approval for large sales
6. **Sales Targets**: Individual/team sales goals and tracking
7. **Inventory Control**: Separate permissions for inventory management
8. **Finance Reports**: Advanced financial reports for admin/manager

---

## 🔗 Related Files

- User Entity: `backend/src/main/java/com/venteapp/entity/User.java`
- Security Config: `backend/src/main/java/com/venteapp/config/SecurityConfig.java`
- Data Initializer: `backend/src/main/java/com/venteapp/config/DataInitializer.java`
- Auth Service: `frontend/src/app/core/services/auth.service.ts`
- Auth Guard: `frontend/src/app/core/guards/auth.guard.ts`

