# Quick Start Guide

## 🚀 Running the Application

### Step 1: Start MongoDB
Make sure MongoDB is installed and running on your system:
```bash
# Windows
mongod

# Or if installed as a service
net start MongoDB
```

### Step 2: Start the Backend Server

Open a **new terminal** and run:
```bash
cd D:\CodeSprint2026\OverRide\backend
npm start
```

You should see:
```
Connected to MongoDB ✅
🚀 Server running on http://localhost:5000
```

### Step 3: Frontend is Already Running!

Your frontend is already running in the terminal. Access it at:
**http://localhost:5173**

## 📱 Using the Application

### Admin View (Healthcare Workers)

1. **Dashboard** - View overall statistics and recent households
2. **Households** - Search, filter, and manage all households
   - Create new households
   - View individual household details
   - Record checkups
3. **Community Alerts** - Monitor health patterns across villages
4. **Admin Rewards** - Search and view any household's rewards

### User View (Community Members)

1. **My Rewards** - Enter Household ID to view rewards and benefits
   - See accumulated points
   - Check achievement badges
   - View eligible benefits

### Switching Between Views

Click the **Admin/User** button in the top navigation bar to toggle between admin and user views.

## 🔧 Key Features to Test

### 1. Create a Household
1. Go to **Households**
2. Click **Add Household**
3. Enter:
   - Household ID (e.g., HH-TEST1)
   - Village name
   - Number of family members

### 2. Record a Checkup
1. Click on any household
2. Click **Record Checkup**
3. Add diseases/medications (optional)
4. Submit

**Result**: Household earns 10 points, streak increases

### 3. View Rewards
From household details:
1. Click **Check Rewards**
2. See:
   - Total points
   - Current streak
   - Unlocked badges
   - Available rewards with progress

### 4. Test Community Alerts
1. Record same disease for 3+ households in same village
2. Go to **Community Alerts**
3. See automatic alert generated

## 🔍 Testing Data

Try these pre-existing Household IDs:
- `HH-12345` - 450 points, 12-month streak
- `HH-67890` - 180 points, 4-month streak
- `HH-11111` - 850 points, 24-month streak (all badges unlocked!)

## 🌍 Language Support

Click the **Globe** button to cycle through:
- English
- हिन्दी (Hindi)
- தமிழ் (Tamil)

## 🎮 Understanding Gamification

### Points
- Base: 10 points per checkup
- Bonus: +20 for 3-month streak
- Bonus: +50 for 6-month streak

### Streaks
- Maintained by monthly checkups (25-35 days apart)
- Broken if checkup missed (>35 days)

### Badges
- Automatically unlocked based on achievements
- Displayed in household details and rewards page

### Reward Tiers
Check the rewards page to see:
- 30 points → Free Basic Medicines
- 50 points → 5kg Ration Support
- 100 points → Health Checkup Camp
- 150 points → 10kg Ration Support

## ⚙️ API Endpoints

Base URL: `http://localhost:5000/api`

### Quick Test in Browser/Postman

**Get all households:**
```
GET http://localhost:5000/api/households
```

**Get dashboard stats:**
```
GET http://localhost:5000/api/analytics/dashboard
```

**Get rewards for a household:**
```
GET http://localhost:5000/api/rewards/HH-12345
```

**Get community alerts:**
```
GET http://localhost:5000/api/community-alerts
```

## 🐛 Troubleshooting

### Frontend shows blank screen?
- Check browser console (F12)
- Make sure `npm run dev` is running
- Try refreshing the page (Ctrl+F5)

### Backend connection error?
- Ensure MongoDB is running on port 27017
- Check if backend server started successfully on port 5000
- Verify no firewall blocking ports

### Rewards not showing?
- Make sure you're looking at the household details page
- Click the "Check Rewards" button
- Or use the dedicated Rewards pages (Admin/User)

### Community alerts not appearing?
- Need 3+ households in same village reporting same issue
- Must be within last 30 days
- Check the Community Alerts page

## 📝 Next Steps

1. **Explore the Dashboard** - See visualizations of checkup completion
2. **Create Test Data** - Add your own households
3. **Record Multiple Checkups** - Build up streaks and unlock badges
4. **Test Community Detection** - Create health patterns
5. **Try Different Languages** - Test multilingual support

## 🎯 Demo Flow

Perfect sequence for demonstrating the system:

1. Start in **Admin View**
2. Show **Dashboard** with current stats
3. Create a new household
4. Record a checkup with a common disease (e.g., "Fever")
5. Record same disease for 2-3 more households in same village
6. Show **Community Alert** generated
7. Click on a household with good streak
8. Show **Check Rewards** with badges and benefits
9. Switch to **User View**
10. Enter household ID and show user-facing rewards page
11. Toggle languages to show multilingual support

---

**Happy Testing! 🎉**

For more details, see the main [README.md](README.md)
