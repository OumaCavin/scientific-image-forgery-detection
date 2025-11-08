#!/usr/bin/env python3
"""
Project Setup Script
Author: Cavin Otieno

This script initializes the project, sets up the database, and prepares the environment
for development and production use.
"""

import os
import sys
import subprocess
import logging
from pathlib import Path
from typing import List, Optional

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ProjectSetup:
    """Project setup and initialization class"""
    
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.models_dir = self.root_dir / "models"
        self.data_dir = self.root_dir / "data"
        
    def check_prerequisites(self) -> bool:
        """Check if required tools and dependencies are available"""
        logger.info("Checking prerequisites...")
        
        required_tools = ["python3", "pip", "node", "npm", "git"]
        missing_tools = []
        
        for tool in required_tools:
            if not self._command_exists(tool):
                missing_tools.append(tool)
        
        if missing_tools:
            logger.error(f"Missing required tools: {', '.join(missing_tools)}")
            return False
        
        # Check Python version
        python_version = sys.version_info
        if python_version < (3, 9):
            logger.error(f"Python 3.9+ required, found {python_version.major}.{python_version.minor}")
            return False
        
        logger.info("✅ All prerequisites met")
        return True
    
    def create_directories(self) -> None:
        """Create necessary project directories"""
        logger.info("Creating project directories...")
        
        directories = [
            self.root_dir / "logs",
            self.root_dir / "uploads",
            self.root_dir / "results",
            self.data_dir / "raw",
            self.data_dir / "processed",
            self.data_dir / "results",
            self.models_dir / "trained",
            self.models_dir / "checkpoints",
            self.models_dir / "configs",
            self.root_dir / "tests" / "backend",
            self.root_dir / "tests" / "frontend",
            self.root_dir / "config",
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created directory: {directory}")
    
    def setup_backend(self) -> None:
        """Setup Python backend environment"""
        logger.info("Setting up backend environment...")
        
        # Create virtual environment
        venv_path = self.backend_dir / "venv"
        if not venv_path.exists():
            logger.info("Creating Python virtual environment...")
            subprocess.run([sys.executable, "-m", "venv", str(venv_path)], check=True)
        
        # Determine pip path
        if os.name == 'nt':  # Windows
            pip_path = venv_path / "Scripts" / "pip"
            python_path = venv_path / "Scripts" / "python"
        else:  # Unix/Linux/macOS
            pip_path = venv_path / "bin" / "pip"
            python_path = venv_path / "bin" / "python"
        
        # Install dependencies
        logger.info("Installing Python dependencies...")
        subprocess.run([str(pip_path), "install", "-r", str(self.backend_dir / "requirements.txt")], check=True)
        
        # Create activation script
        activation_script = self.root_dir / "activate_backend.sh"
        with open(activation_script, 'w') as f:
            f.write(f"""#!/bin/bash
# Backend environment activation script
# Author: Cavin Otieno

echo "Activating backend environment..."
source "{venv_path}/bin/activate"
echo "Backend environment activated!"
echo "Python: $(which python)"
echo "Pip: $(which pip)"

# Set environment variables
export PYTHONPATH="{self.root_dir}/backend:$PYTHONPATH"
export MODEL_PATH="{self.models_dir}/trained/best_model.pth"
export ENVIRONMENT=development

# Start development server
echo "Starting development server..."
cd "{self.backend_dir}"
python main.py
""")
        
        os.chmod(activation_script, 0o755)
        logger.info(f"Created activation script: {activation_script}")
    
    def setup_frontend(self) -> None:
        """Setup Node.js frontend environment"""
        logger.info("Setting up frontend environment...")
        
        # Change to frontend directory
        os.chdir(self.frontend_dir)
        
        # Install dependencies
        logger.info("Installing Node.js dependencies...")
        subprocess.run(["npm", "install"], check=True)
        
        # Create activation script
        activation_script = self.root_dir / "activate_frontend.sh"
        with open(activation_script, 'w') as f:
            f.write(f"""#!/bin/bash
# Frontend environment activation script
# Author: Cavin Otieno

echo "Activating frontend environment..."
cd "{self.frontend_dir}"
echo "Frontend environment activated!"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# Set environment variables
export VITE_API_URL="http://localhost:8000/api/v1"
export VITE_SUPABASE_URL="https://ygcnkooxairnavbrqblq.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY25rb294YWlybmF2YnJxYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTYzNDIsImV4cCI6MjA3ODE5MjM0Mn0.unUUGGG5ap5aeiPFsVKq1eLHRw_ok9GbrOcCLbyylIo"

# Start development server
echo "Starting development server..."
npm run dev
""")
        
        os.chmod(activation_script, 0o755)
        logger.info(f"Created activation script: {activation_script}")
        
        # Return to root directory
        os.chdir(self.root_dir)
    
    def setup_docker(self) -> None:
        """Setup Docker environment"""
        logger.info("Setting up Docker environment...")
        
        # Create development docker-compose file
        dev_compose = self.root_dir / "docker-compose.dev.yml"
        with open(dev_compose, 'w') as f:
            f.write("""version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=development
      - DEBUG=true
      - SUPABASE_URL=https://ygcnkooxairnavbrqblq.supabase.co
      - SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY25rb294YWlybmF2YnJxYmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MTYzNDIsImV4cCI6MjA3ODE5MjM0Mn0.unUUGGG5ap5aeiPFsVKq1eLHRw_ok9GbrOcCLbyylIo
    volumes:
      - ./backend:/app
      - ./models:/app/models
      - ./data:/app/data
      - ./logs:/app/logs
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - app-network
    depends_on:
      - backend

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
""")
        
        logger.info(f"Created development Docker compose file: {dev_compose}")
    
    def initialize_git(self) -> None:
        """Initialize git repository if not exists"""
        if not (self.root_dir / ".git").exists():
            logger.info("Initializing git repository...")
            subprocess.run(["git", "init"], cwd=self.root_dir, check=True)
            subprocess.run(["git", "config", "user.name", "Cavin Otieno"], cwd=self.root_dir, check=True)
            subprocess.run(["git", "config", "user.email", "cavin.otieno012@gmail.com"], cwd=self.root_dir, check=True)
            
            # Create .gitignore
            gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Database
*.db
*.sqlite
*.sqlite3

# Uploads and results
uploads/
results/

# Models
models/trained/*.pth
models/checkpoints/*

# Docker
.docker/

# Temporary files
tmp/
temp/
"""
            
            with open(self.root_dir / ".gitignore", 'w') as f:
                f.write(gitignore_content)
            
            logger.info("Initialized git repository with .gitignore")
        else:
            logger.info("Git repository already exists")
    
    def create_startup_scripts(self) -> None:
        """Create startup and development scripts"""
        
        # Main startup script
        startup_script = self.root_dir / "start.sh"
        with open(startup_script, 'w') as f:
            f.write(f"""#!/bin/bash
# Scientific Image Forgery Detection System Startup Script
# Author: Cavin Otieno

echo "🚀 Starting Scientific Image Forgery Detection System"
echo "=" * 60

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Using Docker for development"
    echo "Starting services with Docker Compose..."
    docker-compose -f docker-compose.dev.yml up -d
    
    echo ""
    echo "✅ Services started!"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8000"
    echo "API Documentation: http://localhost:8000/docs"
    echo ""
    echo "To view logs: docker-compose -f docker-compose.dev.yml logs -f"
    echo "To stop services: docker-compose -f docker-compose.dev.yml down"
else
    echo "💻 Starting with local development servers"
    echo ""
    
    # Start backend
    echo "Starting backend server..."
    source ./activate_backend.sh &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    echo "Starting frontend server..."
    source ./activate_frontend.sh &
    FRONTEND_PID=$!
    
    echo ""
    echo "✅ Development servers started!"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8000"
    echo "API Documentation: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    
    # Wait for user interrupt
    trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
fi
""")
        
        os.chmod(startup_script, 0o755)
        
        # Build script
        build_script = self.root_dir / "build.sh"
        with open(build_script, 'w') as f:
            f.write("""#!/bin/bash
# Build script for production deployment
# Author: Cavin Otieno

echo "🔨 Building Scientific Image Forgery Detection System for production"
echo "=" * 70

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Build Docker image
echo "Building Docker image..."
docker build -t scientific-image-forgery-detection:latest .

echo "✅ Build completed!"
echo "Docker image: scientific-image-forgery-detection:latest"
echo "Frontend build: frontend/dist/"
""")
        
        os.chmod(build_script, 0o755)
    
    def _command_exists(self, command: str) -> bool:
        """Check if a command exists in the system"""
        import shutil
        return shutil.which(command) is not None
    
    def run_setup(self) -> bool:
        """Run the complete setup process"""
        logger.info("Starting Scientific Image Forgery Detection System setup...")
        logger.info(f"Project root: {self.root_dir}")
        
        try:
            # Check prerequisites
            if not self.check_prerequisites():
                return False
            
            # Create directories
            self.create_directories()
            
            # Setup environments
            self.setup_backend()
            self.setup_frontend()
            self.setup_docker()
            
            # Initialize git
            self.initialize_git()
            
            # Create startup scripts
            self.create_startup_scripts()
            
            logger.info("=" * 60)
            logger.info("✅ Setup completed successfully!")
            logger.info("=" * 60)
            logger.info("Next steps:")
            logger.info("1. Activate backend: source activate_backend.sh")
            logger.info("2. Activate frontend: source activate_frontend.sh")
            logger.info("3. Or use Docker: docker-compose -f docker-compose.dev.yml up")
            logger.info("4. Or run startup script: ./start.sh")
            logger.info("")
            logger.info("Useful commands:")
            logger.info("- Start development: ./start.sh")
            logger.info("- Build for production: ./build.sh")
            logger.info("- View API docs: http://localhost:8000/docs")
            logger.info("- Access web app: http://localhost:3000")
            logger.info("")
            logger.info("Competition: Recod.ai/LUC Scientific Image Forgery Detection")
            logger.info("Author: Cavin Otieno")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Setup failed: {e}")
            return False


def main():
    """Main entry point"""
    setup = ProjectSetup()
    success = setup.run_setup()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
