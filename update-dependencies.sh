#!/bin/bash

echo "Updating dependencies to fix security vulnerabilities..."

# Update backend dependencies
echo "Updating backend dependencies..."
cd admin-node-app
npm install

# Update frontend dependencies  
echo "Updating frontend dependencies..."
cd ../admin
npm install

echo "Dependencies updated successfully!"
echo "Please restart both applications to apply the changes."