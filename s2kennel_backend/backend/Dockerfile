FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install gunicorn psycopg2-binary

# Copy project
COPY . /app/

# Create necessary directories
RUN mkdir -p /app/static /app/media

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "s2kennel_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
