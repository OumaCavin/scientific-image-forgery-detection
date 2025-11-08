# Use Python 3.9 slim image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        curl \
        git \
        libgl1-mesa-glx \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender-dev \
        libgomp1 \
        libglib2.0-0 \
        libgl1-mesa-dev \
    && rm -rf /var/lib/apt/lists/*

# Install CUDA dependencies (for GPU support)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nvidia-cuda-toolkit \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY models/ ./models/
COPY data/ ./data/

# Create necessary directories
RUN mkdir -p /app/logs /app/uploads /app/results

# Set environment variables
ENV MODEL_PATH=/app/models/trained/best_model.pth
ENV DEVICE=cuda
ENV ENVIRONMENT=production

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["python", "backend/main.py"]
