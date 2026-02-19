# Personal Finance Tracker

A comprehensive full-stack personal wealth management application combining real-time transaction tracking, ML-driven financial predictions, and personalized savings goal recommendations. Built with React and Flask, with Firebase integration for secure user authentication and data persistence.

## Overview

Personal Finance Tracker helps users:
- **Track** income and expenses in real-time
- **Predict** optimal savings rates using various machine learning models
- **Plan** financial goals with AI-driven recommendations
- **Analyze** spending patterns with interactive visualizations
- **Authenticate** securely with Google accounts via Firebase

![Dashboard Overview](assets/Dashboard_image.png)

## Project Structure

```
.
├── backend/                           # Flask backend API
│   ├── app.py                        # Main Flask application
│   ├── project.ipynb                 # Model training & analysis notebook
│   ├── test_flask.py                 # API testing suite
│   ├── desired_savings_model.pkl     # Savings prediction model
│   ├── desired_savings_percentage_model.pkl
│   ├── kmeans_model.pkl              # Risk categorization model
│   ├── scaler.pkl                    # Feature scaler
│   ├── label_encoder_*.pkl           # Categorical encoders
│   └── venv/                # Python virtual environment
│
└── personal-finance-tracker/         # React frontend application
    └── frontend/
        ├── package.json              # Dependencies & scripts
        ├── public/
        │   └── index.html            # HTML entry point
        └── src/
            ├── App.js                # Main router & routes
            ├── firebase.js           # Firebase configuration
            ├── components/
            │   ├── Dashboard.js      # Main transaction dashboard
            │   ├── Signup.js         # Authentication component
            │   ├── Cards.js          # Summary cards display
            │   ├── TransactionSearch.js
            │   ├── NoTransactions.js
            │   ├── Prediction/       # Savings prediction form
            │   │   └── Prediction.js
            │   ├── Goals/            # Goal calculation module
            │   │   └── Goal.js
            │   ├── Header/           # Navigation header
            │   ├── Loader/           # Loading spinner
            │   └── Modals/
            │       ├── AddExpense.js # Expense entry form
            │       └── AddIncome.js  # Income entry form
            ├── assets/               # Images & static files
            └── styles.css            # Global styling
```

## Features

### 🔐 Authentication
- **Google Sign-In** via Firebase Authentication
- Secure session management with react-firebase-hooks
- User-specific transaction isolation

### 💰 Transaction Management
- **Add/Edit/Delete** income and expense transactions
- **Real-time balance** calculation
- **Transaction categorization**
- Search and filter transactions by date/amount/category

![Transaction Management](assets/transactions_image.png)

### 🤖 AI-Powered Financial Predictions
The `/predict` endpoint analyzes user financial profiles:

**Input Parameters:**
- Income
- Age
- Dependents
- Occupation (encoded)
- City Tier (Tier 1/2/3)
- Disposable Income
- Total Expenses

![Prediction Form](assets/prediction_form_image.png)

**ML Models Used:**
- **Regression Model 1**: Predicts optimal savings amount (in currency)
- **Regression Model 2**: Predicts optimal savings percentage (0-100%)
- **KMeans Clustering**: Assigns risk category (Low/Moderate/High)

**Output:**
```json
{
  "Predicted_Savings": 5000,
  "Predicted_Percentage": 15.5,
  "Risk_Category": "Moderate Risk"
}
```

### 🎯 Smart Savings Goals
The `/goal` endpoint provides personalized recommendations:

**Input Parameters:**
- Target Amount (₹)
- Timeline (months)
- Predicted Savings (from prediction model)
- Risk Category

![Goals Planning](assets/goals_image.png)

**Calculations:**
- Required monthly savings rate
- Savings gap analysis
- Term classification (Short/Mid/Long-term)

**Investment Recommendations** tailored by:
1. **Time Horizon** (Short ≤12 months, Mid 12-60 months, Long >60 months)
2. **Risk Tolerance** (Low/Moderate/High)
3. **Indian Financial Products** (Fixed Deposits, Mutual Funds, PPF, NPS, REITs, Stocks)

**Example Output:**
```json
{
  "Required_Monthly_Savings": 2500,
  "Savings_Gap": 500,
  "Recommendations": [
    "Reduce discretionary expenses by ₹500 per month.",
    "Invest in Balanced Mutual Funds or Index Funds...",
    "Since your goal is categorized as a Mid-Term goal..."
  ]
}
```

### 📊 Data Visualization
- Interactive charts powered by **Ant Design Charts** (`@ant-design/charts`)
- Real-time sum of income/expenses
- Transaction history display

### 📰 News & Analytics
- News feed with financial news aggregation
![News & Analytics](assets/news_image%20-%20Copy.png)

### 🗃️ Data Persistence
- **Firestore** database for transaction storage
- User-scoped data collections (users → uid → transactions)
- CSV import/export via **PapaParse**

## Technology Stack

### Frontend
- **React 18.2** - UI library
- **React Router 6.11** - Client-side routing
- **Firebase SDK 9.21** - Authentication & Firestore
- **Ant Design 4.24** - UI components library
- **Ant Design Charts** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Moment.js** - Date formatting
- **PapaParse** - CSV handling

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning (models, preprocessing)
- **Joblib** - Model serialization
- **Python 3.11** (via virtual environment)

### Infrastructure
- **Firebase** - Authentication & hosting
- **Google Cloud** - Backend services

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+
- Firebase account with configured project
- Git

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd personal-finance-tracker/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Update [frontend/src/firebase.js](frontend/src/firebase.js) with your Firebase credentials
   - Current project: `personal-finance-tracker-e74e8`

4. **Start development server:**
   ```bash
   npm start
   ```
   Opens [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies (if not already installed):**
   ```bash
   pip install flask flask-cors pandas scikit-learn joblib
   ```

4. **Ensure ML models are present:**
   - `desired_savings_model.pkl`
   - `desired_savings_percentage_model.pkl`
   - `kmeans_model.pkl`
   - `scaler.pkl`
   - `label_encoder_occupation.pkl`
   - `label_encoder_city_tier.pkl`

5. **Start Flask server:**
   ```bash
   python app.py
   ```
   Server runs on [http://127.0.0.1:5000](http://127.0.0.1:5000)

## API Endpoints

### `/predict` (POST)
**Purpose:** Predict savings amount, percentage, and risk category

**Request:**
```json
{
  "Income": 500000,
  "Age": 30,
  "Dependents": 2,
  "Occupation": "Professional",
  "City_Tier": "Tier_1",
  "Disposable_Income": 100000,
  "Total_Expenses": 400000
}
```

**Response:**
```json
{
  "Predicted_Savings": 45000,
  "Predicted_Percentage": 9.5,
  "Risk_Category": "Moderate Risk"
}
```

### `/goal` (POST)
**Purpose:** Calculate savings goals and provide investment recommendations

**Request:**
```json
{
  "target_amount": 500000,
  "timeline_months": 24,
  "predicted_savings": 25000,
  "risk_category": "Moderate Risk"
}
```

**Response:**
```json
{
  "Required_Monthly_Savings": 20833.33,
  "Savings_Gap": -4166.67,
  "Recommendations": [...]
}
```

## Available NPM Scripts

### Frontend Development
```bash
# Start development server with hot reload
npm start

# Build for production (minified, optimized)
npm run build

# Run test suite in watch mode
npm test

# Eject configuration (irreversible - use cautiously)
npm run eject
```

## Component Architecture

### Key Components

**[Dashboard.js](personal-finance-tracker/frontend/src/components/Dashboard.js)** (496 lines)
- Main application hub
- Displays summary cards (balance, income, expenses)
- Transaction list and operations
- Modal triggers for adding transactions

**[Prediction.js](personal-finance-tracker/frontend/src/components/Prediction/Prediction.js)**
- Financial profile form
- API call to `/predict` endpoint
- Navigation to goal planning

**[Goal.js](personal-finance-tracker/frontend/src/components/Goals/Goal.js)**
- Savings goal form
- Receives risk category from prediction
- Displays recommendations

**[Signup.js](personal-finance-tracker/frontend/src/components/Signup.js)**
- Google authentication flow
- Session management

### Routing Structure
```
/                    → SignUpSignIn (authentication)
/dashboard           → Dashboard (main app)
/predict             → PredictionForm (ML predictions)
/goal                → GoalForm (savings goals)
```

## Machine Learning Models

### Model Training ([project.ipynb](backend/project.ipynb))
The Jupyter notebook contains:
- Data loading and exploration
- Feature engineering (income, age, dependents, etc.)
- Model training and evaluation
- Model serialization to pickle files

### Feature Preprocessing
1. **Numerical Features Scaled:** Income, Age, Disposable Income, Total Expenses
2. **Categorical Encoding:**
   - Occupation → Label encoded
   - City_Tier → Label encoded (Tier_1, Tier_2, Tier_3)
3. **Feature Order:** Income, Age, Dependents, Occupation, City_Tier, Disposable_Income, Total_Expenses

### Model Artifacts
- **desired_savings_model.pkl** - Regression for absolute savings amount
- **desired_savings_percentage_model.pkl** - Regression for savings percentage
- **kmeans_model.pkl** - Clustering for risk assessment
- **scaler.pkl** - StandardScaler for numerical features
- **label_encoder_occupation.pkl** - Categorical encoder
- **label_encoder_city_tier.pkl** - Categorical encoder

## Testing

### Backend Testing
```bash
python test_flask.py
```

Tests located in [backend/test_flask.py](backend/test_flask.py)

## Database Schema

### Firestore Structure
```
users/
└── {uid}/
    └── transactions/
        └── {transactionId}/
            ├── amount: number
            ├── type: "income" | "expense"
            ├── category: string
            ├── date: timestamp
            └── description: string
```

## Environment Variables

### Frontend (.env recommended)
```
REACT_APP_FIREBASE_API_KEY=AIzaSyBH2NuZZqfUo3kk_FDD07-ejd1Y2SlV458
REACT_APP_FIREBASE_AUTH_DOMAIN=personal-finance-tracker-e74e8.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=personal-finance-tracker-e74e8
```

### Backend
- Flask runs in debug mode when started locally
- CORS enabled for localhost:3000

## Performance Considerations

- **ML Model Load Time:** Models are loaded once on Flask startup
- **Firestore Indexing:** Created for user → transactions queries
- **Frontend State Management:** React hooks (useState, useEffect) for local state
- **CSV Processing:** PapaParse handles large file uploads efficiently

## Security

- ✅ Google OAuth 2.0 authentication
- ✅ Firebase security rules (user-scoped data access)
- ✅ CORS configured for origin validation
- ⚠️ **TODO:** Add environment variables for sensitive API keys
- ⚠️ **TODO:** Implement rate limiting on `/predict` and `/goal` endpoints

## Known Limitations & Future Work

### Current Limitations
- Single-device session management
- No mobile app version
- Limited offline support

### Future Enhancements
- 📱 Mobile app (React Native)
- 💾 Data export to PDF/Excel
- 🔔 Spending alerts and notifications
- 📈 Advanced analytics and trend analysis
- 🌐 Multi-currency support
- 🔄 Recurring transaction templates
- 🤝 Multi-user family budgeting
- 📊 Portfolio tracking integration
- 🎯 Advanced goal prioritization and comparison

## Troubleshooting

### Flask Backend Issues
**Error:** `ModuleNotFoundError: No module named 'flask'`
- Solution: Activate virtual environment and run `pip install flask flask-cors`

**Error:** `Model file not found` (*.pkl files)
- Solution: Ensure pickle files are in backend directory; retrain using [project.ipynb](backend/project.ipynb)

**Error:** CORS errors from frontend
- Solution: Verify Flask `/predict` and `/goal` endpoints are accessible at `http://127.0.0.1:5000`

### React Frontend Issues
**Error:** `Firebase configuration error`
- Solution: Update [firebase.js](personal-finance-tracker/frontend/src/firebase.js) with correct credentials

**Error:** Blank screen or routing issues
- Solution: Clear browser cache, restart dev server with `npm start`

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

This project is private. Unauthorized reproduction or distribution is prohibited.

## Contact & Support

For questions or issues, please refer to the project documentation or contact the development team.

---

**Last Updated:** February 2026  
**Version:** 0.1.0 (Beta)

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
