# Project Structure Documentation
# Author: Cavin Otieno

```
scientific-image-forgery-detection/
├── README.md                          # Main project documentation
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
├── docker-compose.yml                 # Docker compose configuration
├── Dockerfile                         # Docker image definition
├── .github/
│   └── workflows/
│       └── ci-cd.yml                  # CI/CD pipeline configuration
├── backend/                           # Python FastAPI backend
│   ├── main.py                        # Application entry point
│   ├── requirements.txt               # Python dependencies
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment variables template
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py              # Application configuration
│   │   │   └── database.py            # Database configuration
│   │   ├── models/
│   │   │   ├── base.py                # Base model class
│   │   │   ├── user.py                # User model
│   │   │   ├── analysis.py            # Analysis model
│   │   │   └── result.py              # Result model
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── api.py             # API v1 routes
│   │   ├── services/
│   │   │   └── model_service.py       # ML model service
│   │   └── utils/
│   │       └── logger.py              # Logging utilities
├── frontend/                          # React TypeScript frontend
│   ├── package.json                   # Node.js dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── vite.config.ts                 # Vite configuration
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment variables template
│   ├── index.html                     # Main HTML template
│   └── src/
│       ├── main.tsx                   # React entry point
│       ├── App.tsx                    # Main App component
│       ├── components/
│       │   └── Layout.tsx             # Layout component
│       ├── pages/
│       │   ├── HomePage.tsx           # Home page component
│       │   ├── AnalyzePage.tsx        # Analysis page component
│       │   ├── ResultsPage.tsx        # Results page component
│       │   ├── StatisticsPage.tsx     # Statistics page component
│       │   └── AboutPage.tsx          # About page component
│       ├── styles/
│       │   └── globals.css            # Global CSS styles
│       └── utils/
│           └── apiClient.ts           # API client utilities
├── models/                            # ML models and configs
│   ├── trained/
│   │   └── best_model.pth             # Trained model weights
│   ├── configs/
│   │   └── model_config.yaml          # Model configuration
│   └── checkpoints/                   # Training checkpoints
├── data/                              # Dataset and processed data
│   ├── raw/                           # Original dataset
│   │   ├── train_images/              # Training images
│   │   ├── test_images/               # Test images
│   │   ├── train_masks/               # Training masks
│   │   └── sample_submission.csv      # Sample submission format
│   ├── processed/                     # Processed data
│   └── results/                       # Analysis results
├── docs/                              # Documentation
│   ├── API.md                         # API documentation
│   ├── DEPLOYMENT.md                  # Deployment guide
│   ├── ARCHITECTURE.md                # System architecture
│   └── CONTRIBUTING.md                # Contribution guidelines
├── tests/                             # Test suites
│   ├── backend/                       # Backend tests
│   │   ├── test_api.py                # API tests
│   │   ├── test_models.py             # Model tests
│   │   └── test_services.py           # Service tests
│   └── frontend/                      # Frontend tests
│       ├── components/                # Component tests
│       └── pages/                     # Page tests
├── scripts/                           # Utility scripts
│   ├── init_db.py                     # Database initialization
│   ├── migrate.py                     # Database migration
│   ├── train_model.py                 # Model training script
│   ├── analyze_image.py               # Single image analysis
│   └── batch_analyze.py               # Batch analysis script
├── config/                            # Configuration files
│   ├── database.yml                   # Database configuration
│   ├── logging.yml                    # Logging configuration
│   └── deployment.yml                 # Deployment configuration
├── assets/                            # Static assets
│   ├── images/
│   │   ├── banner.png                 # Project banner
│   │   └── logo.svg                   # Project logo
│   └── icons/                         # Icon assets
└── logs/                              # Application logs
    └── app.log                        # Application log file
```

## Key Files Description

### Backend (Python/FastAPI)
- **main.py**: Application entry point with FastAPI setup
- **app/core/config.py**: Configuration management
- **app/services/model_service.py**: ML model service for inference
- **app/api/v1/api.py**: REST API endpoints
- **app/models/**: SQLAlchemy database models
- **requirements.txt**: Python dependencies

### Frontend (React/TypeScript)
- **App.tsx**: Main React application component
- **src/pages/**: React page components
- **src/components/**: Reusable React components
- **src/utils/apiClient.ts**: API communication utilities
- **package.json**: Node.js dependencies and scripts

### Configuration
- **docker-compose.yml**: Multi-service Docker setup
- **.github/workflows/ci-cd.yml**: CI/CD pipeline
- **.env.example**: Environment variables template
- **tailwind.config.js**: CSS framework configuration

### Documentation
- **README.md**: Comprehensive project documentation
- **docs/**: Additional technical documentation
- **LICENSE**: MIT license file

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PyTorch**: Deep learning framework
- **SQLAlchemy**: Database ORM
- **Supabase**: Database and authentication
- **Redis**: Caching and message broker

### Frontend
- **React 18**: Modern JavaScript library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **React Query**: Data fetching and caching

### Infrastructure
- **Docker**: Containerization
- **GitHub Actions**: CI/CD
- **Supabase**: Database hosting
- **Vercel/Netlify**: Frontend hosting

## Development Workflow

1. **Local Development**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   python main.py

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

2. **Testing**
   ```bash
   # Backend tests
   cd backend
   pytest

   # Frontend tests
   cd frontend
   npm test
   ```

3. **Building**
   ```bash
   # Build frontend
   cd frontend
   npm run build

   # Build Docker image
   docker build -t scientific-image-forgery-detection .
   ```

4. **Deployment**
   ```bash
   # Deploy with Docker Compose
   docker-compose up -d

   # Deploy to cloud (Vercel for frontend, Cloud Run for backend)
   ```
