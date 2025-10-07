# Admin Dashboard — Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Access Admin Portal
Open your browser and go to:
```
http://localhost:3000/admin
```

### Step 3: Login
Use these demo credentials:
- **Email**: `admin@onyxry.agency`
- **Password**: `admin123`

---

## 📊 What You Can Do

### 1. Dashboard Overview
**URL**: `/admin/dashboard`

View at a glance:
- 📧 Total enquiries and recent submissions
- 📁 Active projects with progress
- 💰 Revenue metrics
- 📈 Conversion rates

### 2. Manage Enquiries
**URL**: `/admin/enquiries`

- View all customer enquiries
- Filter by status (new, contacted, qualified, etc.)
- Update enquiry status
- Send emails directly
- Track conversion pipeline

### 3. Marketing Campaigns
**URL**: `/admin/campaigns`

- Track email campaigns
- Monitor social media ads
- View content marketing performance
- Analyze PPC campaigns
- See ROI and conversion metrics

### 4. Financial Tracking
**URL**: `/admin/revenue`

- View revenue trends
- Track expenses
- Monitor profit margins
- Manage invoices
- See payment status

### 5. Website Analytics
**URL**: `/admin/analytics`

- Visitor statistics
- Page view tracking
- Traffic source analysis
- Conversion tracking
- Device & browser stats

---

## 🎯 Common Tasks

### Responding to New Enquiry
1. Go to `/admin/enquiries`
2. Click on the enquiry
3. Review details in right panel
4. Click "SEND EMAIL" to respond
5. Update status to "Contacted"

### Tracking Campaign Performance
1. Go to `/admin/campaigns`
2. View metrics for each campaign
3. Compare performance across campaigns
4. Pause/Resume as needed

### Checking Monthly Revenue
1. Go to `/admin/revenue`
2. View revenue chart
3. Check recent transactions
4. Monitor payment status

### Analyzing Website Traffic
1. Go to `/admin/analytics`
2. Select time range (7d, 30d, 90d, 1y)
3. View visitor trends
4. Check top pages
5. Analyze traffic sources

---

## 🎨 Navigation

### Sidebar Menu

**Overview**
- 📊 Dashboard
- 📈 Analytics

**Business**
- 📧 Enquiries
- 👥 Clients
- 📁 Projects

**Marketing**
- 🎯 Campaigns
- 📱 Social Media
- ✉️ Email Marketing

**Finance**
- 💰 Revenue
- 💳 Invoices
- 📊 Expenses

**Settings**
- ⚙️ Settings
- 👤 Profile

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- Press `/` to focus search
- `Esc` to close modals
- `Ctrl/Cmd + K` for quick actions (coming soon)

### Status Color Codes
- 🟢 **Green**: Success, Active, Paid
- 🟡 **Yellow**: Pending, Paused
- 🔵 **Blue**: New, Qualified
- 🟣 **Purple**: Proposal
- 🔴 **Red**: Lost, Overdue

### Best Practices
1. **Update enquiry status** as you progress
2. **Review analytics weekly** to track trends
3. **Monitor campaigns daily** for active ones
4. **Check revenue monthly** for financial health
5. **Respond to new enquiries** within 24 hours

---

## 🔐 Security Notes

⚠️ **Current Setup**: Demo authentication only

**For Production**:
- Implement proper authentication
- Use secure passwords
- Enable 2FA
- Add role-based access
- Use HTTPS only

See `ADMIN_DASHBOARD_GUIDE.md` for full security details.

---

## 📝 Current Limitations

**Demo Version**:
- ✅ Full UI/UX functional
- ✅ All pages accessible
- ✅ Status updates work (in memory)
- ❌ Data doesn't persist (refresh resets)
- ❌ No real database
- ❌ No email sending
- ❌ No file uploads

**Production Ready**:
- Add database (PostgreSQL, MongoDB)
- Implement real authentication
- Connect email service
- Add payment processing
- Enable file storage

---

## 🆘 Need Help?

### Documentation
- **Full Guide**: `ADMIN_DASHBOARD_GUIDE.md`
- **Main README**: `README.md`
- **Setup Guide**: `SETUP.md`

### Common Issues

**Can't login?**
- Use: `admin@onyxry.agency` / `admin123`
- Clear browser cache
- Check console for errors

**Data not saving?**
- Demo uses mock data
- Changes reset on refresh
- Add database for persistence

**Page not loading?**
- Ensure dev server is running
- Check for errors in terminal
- Try clearing `.next` cache

---

## 🎯 Next Steps

### Immediate
1. ✅ Login and explore dashboard
2. ✅ Review all modules
3. ✅ Test enquiry management
4. ✅ Check analytics

### Short-term
1. [ ] Add real database
2. [ ] Implement authentication
3. [ ] Connect email service
4. [ ] Add more modules

### Long-term
1. [ ] Client portal
2. [ ] Team management
3. [ ] Advanced reporting
4. [ ] Mobile app

---

## 📞 Quick Reference

**Admin URL**: `http://localhost:3000/admin`  
**Login**: `admin@onyxry.agency` / `admin123`  
**Logout**: Click logout in sidebar

**Main Modules**:
- Dashboard: `/admin/dashboard`
- Enquiries: `/admin/enquiries`
- Campaigns: `/admin/campaigns`
- Revenue: `/admin/revenue`
- Analytics: `/admin/analytics`

---

**You're all set! Start managing your agency from the admin dashboard.**

**Onyxry — Technology that elevates humanity.**
