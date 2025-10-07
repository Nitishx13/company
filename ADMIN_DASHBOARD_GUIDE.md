# Admin Dashboard Guide — Onyxry Agency

## 🎯 Overview

The Onyxry Admin Dashboard is a comprehensive management system for running your digital agency. It includes modules for enquiry management, marketing campaigns, financial tracking, analytics, and more.

---

## 🔐 Access & Authentication

### Login Credentials

**URL**: `http://localhost:3000/admin`

**Demo Credentials**:
- Email: `admin@onyxry.agency`
- Password: `admin123`

### Security Notes

⚠️ **IMPORTANT**: The current authentication is for demonstration purposes only.

**For Production**:
1. Implement proper authentication (NextAuth.js, Auth0, Clerk)
2. Use secure password hashing (bcrypt, argon2)
3. Add JWT tokens or session management
4. Implement role-based access control (RBAC)
5. Enable two-factor authentication (2FA)
6. Add password reset functionality

---

## 📊 Dashboard Modules

### 1. Main Dashboard (`/admin/dashboard`)

**Overview Stats**:
- Total Enquiries
- Active Projects
- Revenue (Month-to-Date)
- Conversion Rate

**Features**:
- Recent enquiries list with status tracking
- Active projects with progress bars
- Quick action buttons
- Real-time updates

**Use Cases**:
- Daily operations overview
- Quick access to recent activity
- Monitor key metrics at a glance

---

### 2. Enquiries Management (`/admin/enquiries`)

**Features**:
- View all customer enquiries
- Filter by status (new, contacted, qualified, proposal, won, lost)
- Detailed enquiry view with full information
- Status update functionality
- Direct email integration
- Add notes to enquiries

**Enquiry Statuses**:
- **New**: Just received, not yet contacted
- **Contacted**: Initial contact made
- **Qualified**: Qualified as potential client
- **Proposal**: Proposal sent
- **Won**: Converted to client
- **Lost**: Did not convert

**Workflow**:
1. New enquiry arrives → Status: "New"
2. Contact customer → Update to "Contacted"
3. Qualify lead → Update to "Qualified"
4. Send proposal → Update to "Proposal"
5. Close deal → Update to "Won" or "Lost"

**Data Captured**:
- Name, Email, Company
- Service interested in
- Budget range
- Project details
- Submission date

---

### 3. Marketing Campaigns (`/admin/campaigns`)

**Campaign Types**:
- Email Marketing
- Social Media Ads
- Content Marketing
- PPC (Pay-Per-Click)

**Metrics Tracked**:

**Email Campaigns**:
- Sent, Opened, Clicked, Converted
- Open rate, Click rate, Conversion rate

**Social Media**:
- Impressions, Clicks, Leads
- Click-through rate, Cost per lead

**Content Marketing**:
- Views, Shares, Leads
- Engagement rate, Conversion rate

**PPC Campaigns**:
- Impressions, Clicks, Conversions
- Cost per click, Cost per conversion

**Campaign Statuses**:
- **Active**: Currently running
- **Paused**: Temporarily stopped
- **Completed**: Finished

**Features**:
- View all campaigns
- Filter by status
- Detailed metrics for each campaign
- Pause/Resume campaigns
- Budget tracking

---

### 4. Revenue & Finance (`/admin/revenue`)

**Financial Overview**:
- Total Revenue (Year-to-Date)
- Total Expenses (YTD)
- Net Profit (YTD)
- Average Monthly Revenue

**Revenue Trends**:
- Monthly revenue chart
- Visual comparison of revenue vs expenses
- Profit margins
- Growth indicators

**Recent Transactions**:
- Client name and project
- Invoice amount
- Payment date
- Status (Paid, Pending, Overdue)
- Quick access to invoices

**Use Cases**:
- Monthly financial reporting
- Cash flow monitoring
- Revenue forecasting
- Expense tracking

---

### 5. Analytics (`/admin/analytics`)

**Website Metrics**:
- Total Visitors
- Page Views
- Average Session Duration
- Bounce Rate

**Top Pages**:
- Most visited pages
- Average time on page
- Bounce rate per page

**Traffic Sources**:
- Organic Search
- Direct Traffic
- Social Media
- Referrals
- Email

**Conversion Tracking**:
- Contact Form submissions
- Service Enquiries
- Newsletter Signups
- Resource Downloads

**Device & Browser Stats**:
- Desktop vs Mobile vs Tablet
- Browser breakdown
- User behavior patterns

**Time Ranges**:
- 7 days
- 30 days
- 90 days
- 1 year

---

## 🎨 Design System

### Color Coding

**Status Indicators**:
- 🟢 Green: Success, Won, Paid, Active
- 🟡 Yellow: Pending, Contacted, Paused
- 🔵 Blue: New, Qualified, Completed
- 🟣 Purple: Proposal
- 🔴 Red: Lost, Overdue, Error

### Typography
- **Headings**: Bold, large (24-32px)
- **Body**: Regular (14-16px)
- **Labels**: Font-mono, uppercase, small (12px)
- **Numbers**: Bold, large for emphasis

### Layout
- **Sidebar**: 256px fixed width
- **Main Content**: Flexible width
- **Cards**: Border with hover effects
- **Tables**: Striped rows, hover highlights

---

## 🔧 Technical Implementation

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React useState/useEffect
- **Storage**: LocalStorage (demo only)

### File Structure

```
/app/admin/
├── page.tsx                    # Login page
├── dashboard/page.tsx          # Main dashboard
├── enquiries/page.tsx          # Enquiry management
├── campaigns/page.tsx          # Marketing campaigns
├── revenue/page.tsx            # Finance tracking
├── analytics/page.tsx          # Website analytics
└── [other modules]/

/components/admin/
├── AdminSidebar.tsx            # Navigation sidebar
└── AdminHeader.tsx             # Top header with search
```

### Authentication Flow

```typescript
// Login
localStorage.setItem('adminAuth', 'true');

// Check Auth
const auth = localStorage.getItem('adminAuth');
if (!auth) router.push('/admin');

// Logout
localStorage.removeItem('adminAuth');
router.push('/admin');
```

---

## 📝 Data Management

### Current Implementation

**Demo Data**: All data is currently hardcoded for demonstration.

**Storage**: LocalStorage for authentication only.

### Production Implementation

**Recommended Stack**:

1. **Database**: 
   - PostgreSQL (Supabase, Neon)
   - MongoDB (Atlas)
   - Firebase Firestore

2. **ORM**:
   - Prisma
   - Drizzle ORM

3. **API**:
   - Next.js API Routes
   - tRPC
   - GraphQL

4. **Real-time**:
   - Supabase Realtime
   - Pusher
   - Socket.io

### Database Schema Example

```sql
-- Enquiries Table
CREATE TABLE enquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  company VARCHAR(255),
  service VARCHAR(255),
  budget VARCHAR(50),
  message TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  status VARCHAR(50),
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER,
  project_id INTEGER,
  amount DECIMAL(10,2),
  status VARCHAR(50),
  invoice_date DATE,
  payment_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel

# Or deploy to other platforms
# (Netlify, AWS, DigitalOcean, etc.)
```

---

## 🔌 Integration Options

### Email Integration

**SendGrid**:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: enquiry.email,
  from: 'hello@onyxry.agency',
  subject: 'Thank you for your enquiry',
  html: '<p>We received your message...</p>',
};

await sgMail.send(msg);
```

**Resend** (Recommended):
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'hello@onyxry.agency',
  to: enquiry.email,
  subject: 'Thank you for your enquiry',
  html: '<p>We received your message...</p>',
});
```

### Analytics Integration

**Google Analytics**:
```typescript
// app/layout.tsx
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

**Plausible** (Privacy-focused):
```typescript
<Script
  defer
  data-domain="onyxry.agency"
  src="https://plausible.io/js/script.js"
/>
```

### Payment Integration

**Stripe**:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const invoice = await stripe.invoices.create({
  customer: customerId,
  amount: 25000,
  currency: 'usd',
});
```

---

## 📈 Future Enhancements

### Phase 1 (Essential)
- [ ] Real database integration
- [ ] Proper authentication system
- [ ] Email notifications
- [ ] Invoice generation (PDF)
- [ ] File uploads for projects

### Phase 2 (Advanced)
- [ ] Team member management
- [ ] Role-based permissions
- [ ] Client portal
- [ ] Time tracking
- [ ] Automated reporting

### Phase 3 (Premium)
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Automated workflows
- [ ] CRM integration
- [ ] Mobile app

---

## 🛠 Customization

### Adding New Modules

1. **Create Page**:
```typescript
// app/admin/new-module/page.tsx
export default function NewModule() {
  return (
    <div className="flex min-h-screen bg-chalk-dark">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="New Module" />
        <main className="p-8">
          {/* Your content */}
        </main>
      </div>
    </div>
  );
}
```

2. **Add to Sidebar**:
```typescript
// components/admin/AdminSidebar.tsx
{
  section: 'Your Section',
  items: [
    { icon: '🆕', label: 'New Module', href: '/admin/new-module' },
  ],
}
```

### Styling Customization

All admin styles use Tailwind CSS classes. Customize in:
- `tailwind.config.ts` - Colors, spacing, etc.
- Component files - Individual styling
- `app/globals.css` - Global admin styles

---

## 🐛 Troubleshooting

### Common Issues

**1. Can't login**
- Check credentials: `admin@onyxry.agency` / `admin123`
- Clear browser cache and localStorage
- Check browser console for errors

**2. Redirected to login**
- Authentication token expired
- LocalStorage cleared
- Re-login required

**3. Data not updating**
- Currently using mock data
- Changes don't persist (demo only)
- Implement database for persistence

**4. Styling issues**
- Run `npm run dev` to rebuild
- Check Tailwind CSS configuration
- Clear `.next` cache

---

## 📞 Support

For technical support or questions:

**Email**: hello@onyxry.agency  
**Documentation**: Check README.md and other guides  
**Issues**: Create GitHub issue (if using version control)

---

## 🔒 Security Best Practices

### For Production

1. **Authentication**:
   - Use NextAuth.js or similar
   - Implement password hashing
   - Add rate limiting
   - Enable 2FA

2. **Data Protection**:
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries
   - Implement CSRF protection

3. **API Security**:
   - Use API keys
   - Implement rate limiting
   - Add request validation
   - Use HTTPS only

4. **Access Control**:
   - Role-based permissions
   - Audit logs
   - Session management
   - Regular security audits

---

## 📊 Performance Optimization

### Recommendations

1. **Code Splitting**:
   - Use dynamic imports
   - Lazy load components
   - Optimize bundle size

2. **Data Fetching**:
   - Implement pagination
   - Use caching (React Query, SWR)
   - Optimize database queries

3. **Images**:
   - Use Next.js Image component
   - Implement lazy loading
   - Optimize image sizes

4. **Monitoring**:
   - Add error tracking (Sentry)
   - Monitor performance (Vercel Analytics)
   - Track user behavior

---

**Admin Dashboard is ready to use!**  
**Login at**: http://localhost:3000/admin

**Onyxry — Technology that elevates humanity.**
