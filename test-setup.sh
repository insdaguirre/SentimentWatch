#!/bin/bash

# Test Setup Script - Verify all components are working

echo "🧪 Testing Stock Sentiment Tracker Setup..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
passed=0
failed=0

# Function to test a condition
test_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $2"
        ((failed++))
    fi
}

echo "1️⃣  Checking prerequisites..."
echo ""

# Check Node.js
node --version > /dev/null 2>&1
test_check $? "Node.js is installed"

# Check npm
npm --version > /dev/null 2>&1
test_check $? "npm is installed"

# Check MongoDB
pgrep -x "mongod" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    test_check 0 "MongoDB is running"
else
    echo -e "${YELLOW}⚠${NC} MongoDB may not be running locally (Atlas is OK)"
fi

echo ""
echo "2️⃣  Checking project files..."
echo ""

# Check backend files
[ -d "backend/src" ]
test_check $? "Backend source directory exists"

[ -f "backend/package.json" ]
test_check $? "Backend package.json exists"

[ -d "backend/node_modules" ]
if [ $? -eq 0 ]; then
    test_check 0 "Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed. Run: cd backend && npm install"
fi

# Check frontend files
[ -d "frontend/src" ]
test_check $? "Frontend source directory exists"

[ -f "frontend/package.json" ]
test_check $? "Frontend package.json exists"

[ -d "frontend/node_modules" ]
if [ $? -eq 0 ]; then
    test_check 0 "Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed. Run: cd frontend && npm install"
fi

# Check .env
[ -f "backend/.env" ]
if [ $? -eq 0 ]; then
    test_check 0 ".env file exists"
    
    # Check for placeholder values
    if grep -q "your_reddit_client_id" backend/.env; then
        echo -e "${YELLOW}⚠${NC} .env contains placeholder values - update with real credentials"
    fi
else
    echo -e "${YELLOW}⚠${NC} .env file not found. Run: cp backend/env.example backend/.env"
fi

echo ""
echo "3️⃣  Testing API connectivity..."
echo ""

# Check if backend is running
curl -s http://localhost:5000/ > /dev/null 2>&1
if [ $? -eq 0 ]; then
    test_check 0 "Backend server is running"
    
    # Test health endpoint
    response=$(curl -s http://localhost:5000/api/sentiment/health)
    if echo "$response" | grep -q "healthy"; then
        test_check 0 "Health endpoint responding"
    else
        test_check 1 "Health endpoint not responding correctly"
    fi
else
    echo -e "${YELLOW}⚠${NC} Backend not running. Start with: cd backend && npm start"
fi

# Check if frontend is running
curl -s http://localhost:3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    test_check 0 "Frontend server is running"
else
    echo -e "${YELLOW}⚠${NC} Frontend not running. Start with: cd frontend && npm start"
fi

echo ""
echo "4️⃣  Checking MongoDB data..."
echo ""

# Try to connect to MongoDB and check data
if command -v mongosh > /dev/null 2>&1; then
    count=$(mongosh stock-sentiment --quiet --eval "db.sentimentposts.countDocuments()" 2>/dev/null)
    if [ ! -z "$count" ]; then
        echo -e "${GREEN}✓${NC} MongoDB accessible: $count posts in database"
    else
        echo -e "${YELLOW}⚠${NC} Could not query MongoDB (may need to run worker first)"
    fi
else
    echo -e "${YELLOW}⚠${NC} mongosh not installed (optional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "Test Results: ${GREEN}${passed} passed${NC}, ${RED}${failed} failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Make sure MongoDB is running"
    echo "2. Start backend: cd backend && npm start"
    echo "3. Start worker: cd backend && npm run worker"
    echo "4. Start frontend: cd frontend && npm start"
    echo "5. Open http://localhost:3000"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Install dependencies: cd backend && npm install && cd ../frontend && npm install"
    echo "2. Create .env: cp backend/env.example backend/.env"
    echo "3. Start MongoDB: brew services start mongodb-community"
fi

echo ""

