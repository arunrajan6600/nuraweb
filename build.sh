#!/bin/bash
echo "Starting build process..."

# Create temp directory
mkdir -p temp-api

# Check if we're in admin mode
if [ "$NEXT_PUBLIC_ADMIN_ENABLED" = "true" ]; then
  echo "Admin mode - keeping API routes"
  next build
else
  echo "Non-admin mode - moving API routes"
  # Move API routes to temp directory
  if [ -d "app/api" ]; then
    mv app/api temp-api-backup
  fi
  
  # Run the build
  next build
  
  # Restore API routes
  if [ -d "temp-api-backup" ]; then
    rm -rf app/api
    mv temp-api-backup app/api
  fi
fi

# Return API routes if they were moved
if [ "$NEXT_PUBLIC_ADMIN_ENABLED" != "true" ]; then
  # Restore API routes
  mkdir -p app/api
  mv temp-api/* app/api/ 2>/dev/null || true
fi

# Cleanup
rm -rf temp-api
touch out/.nojekyll

echo "Build process completed"
