#!/bin/bash

# Simple Docker build and run script for Teable

echo "Building Teable Docker image..."
docker build -t teable:latest .

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Starting Teable container..."
    docker run -p 3000:3000 -v $(pwd)/db:/app/db teable:latest
else
    echo "Build failed!"
    exit 1
fi
