# PayStreet Cross-Border Remittance Platform

A comprehensive cross-border payments platform built with React, Express.js, and MongoDB that demonstrates user onboarding, beneficiary management, money transfer workflows, live FX rates integration, and admin functionality.

## Features

### Core Features
- **User Authentication**: JWT-based signup/login with auto-generated UUID account numbers
- **Beneficiary Management**: Full CRUD operations for payment recipients
- **Money Transfer Workflow**: Multi-step transfer process with live FX rates
- **Transaction History**: Comprehensive transaction tracking with filters and search
- **Admin Panel**: Role-based admin dashboard with user and transaction oversight
- **Live FX Rates**: Real-time currency conversion with 15-minute caching

### Technical Highlights
- **Frontend**: React 18 with TypeScript, TailwindCSS, React Router
- **Backend**: Express.js with MongoDB, JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: ExchangeRate.host for live FX rates
- **Security**: JWT authentication, role-based access control
- **Caching**: 15-minute FX rate caching with fallback mechanism

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or cloud)

### Installation

1. **Clone and install dependencies**:
   ```bash
   # Install all dependencies (frontend + backend)
   npm run install-all
   ```

2. **Set up environment variables**:
   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env
   ```

3. **Configure your MongoDB connection**:
   Edit `server/.env` and add your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random
   PORT=3001
   ```

4. **Start the development servers**:
   ```bash
   # Starts both frontend (port 5173) and backend (port 3001)
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Demo Accounts

The application includes pre-seeded demo accounts:

- **Admin**: admin@paystreet.com / admin123
- **User**: user@paystreet.com / user123

## Project Structure

```
paystreet-remittance-platform/
├── src/                      # React frontend
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth)
│   ├── lib/                # API services and utilities
│   └── types/              # TypeScript type definitions
├── server/                  # Express.js backend
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Authentication middleware
│   ├── services/           # Business logic services
│   └── index.js            # Server entry point
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Beneficiaries
- `GET /api/beneficiaries` - Get user's beneficiaries
- `POST /api/beneficiaries` - Create beneficiary
- `PUT /api/beneficiaries/:id` - Update beneficiary
- `DELETE /api/beneficiaries/:id` - Delete beneficiary

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions/transfer` - Create money transfer

### FX Rates
- `GET /api/fx-rates?from=USD&to=EUR&amount=100` - Get exchange rate

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions

## Key Features Detail

### Money Transfer Workflow
1. **Select Beneficiary**: Choose from saved beneficiaries
2. **Enter Amount**: Specify source amount and currency
3. **Rate Calculation**: Live FX rates with fee calculation (2% + $5)
4. **Review & Confirm**: Summary with exchange rate and final amounts
5. **Transaction Complete**: Immediate confirmation with transaction ID

### FX Rate Integration
- Uses ExchangeRate.host API for live rates
- 15-minute caching to reduce API calls
- Graceful fallback to cached rates on API failures
- Supports major currencies: USD, EUR, GBP, INR, CAD, AUD, JPY, SGD

### Admin Features
- **User Management**: View all registered users
- **Transaction Oversight**: Monitor all system transactions
- **High-Risk Flagging**: Automatic flagging of transactions >$10,000 USD equivalent
- **Analytics Dashboard**: Transaction volume, success rates, and risk metrics

### Security Features
- JWT-based authentication with secure token handling
- Role-based access control (user/admin)
- Password hashing with bcrypt
- Protected API routes with authentication middleware

## Development Scripts

```bash
# Install all dependencies (frontend + backend)
npm run install-all

# Start both frontend and backend in development mode
npm run dev

# Start only frontend
npm run client

# Start only backend
npm run server

# Build frontend for production
npm run build

# Run frontend in preview mode
npm run preview
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/paystreet
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
PORT=3001
```

## Deployment Considerations

### Frontend
- Build with `npm run build`
- Deploy `dist/` folder to Vercel, Netlify, or similar
- Configure environment variables for API endpoints

### Backend
- Deploy to Heroku, Railway, or similar Node.js hosting
- Set environment variables in hosting platform
- Ensure MongoDB connection is accessible

### Database
- Use MongoDB Atlas for cloud hosting
- Configure connection string with proper credentials
- Set up database indexes for optimal performance

## Technical Decisions

### Architecture
- **Monorepo Structure**: Frontend and backend in single repository for easier development
- **RESTful API**: Clear, standard REST endpoints for all operations
- **JWT Authentication**: Stateless authentication suitable for scalability
- **MongoDB**: Document database perfect for flexible transaction and user data

### Frontend Design
- **Component-Based**: Modular React components for reusability
- **Context API**: Centralized authentication state management
- **TailwindCSS**: Utility-first CSS for rapid UI development
- **TypeScript**: Type safety throughout the application

### Backend Architecture
- **Express.js**: Lightweight, flexible Node.js framework
- **Mongoose ODM**: Object modeling for MongoDB with validation
- **Middleware Pattern**: Reusable authentication and authorization logic
- **Service Layer**: Separate business logic from route handlers

## Performance Optimizations

- **FX Rate Caching**: 15-minute cache reduces external API calls
- **Database Indexing**: Optimized queries for user and transaction lookups
- **Pagination Ready**: Transaction lists designed for future pagination
- **Lazy Loading**: Components loaded as needed

## Security Best Practices

- **Input Validation**: All user inputs validated on both client and server
- **SQL Injection Prevention**: Mongoose ODM provides built-in protection
- **XSS Protection**: React's built-in XSS protection
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Variables**: Sensitive data kept in environment variables

## Future Enhancements

### Planned Features
- **Transaction Receipts**: PDF generation for transaction confirmations
- **KYC Integration**: Mock KYC check API integration
- **Email Notifications**: Transaction status notifications
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Enhanced reporting and analytics dashboard

### Technical Improvements
- **Unit Tests**: Comprehensive test coverage for components and API
- **Integration Tests**: End-to-end testing with Cypress or Playwright
- **Rate Limiting**: API rate limiting for production deployment
- **Logging**: Structured logging with Winston or similar
- **Monitoring**: Application performance monitoring

## Support and Contribution

This is a demonstration project showcasing full-stack development capabilities with modern web technologies. The codebase follows industry best practices and is structured for scalability and maintainability.
