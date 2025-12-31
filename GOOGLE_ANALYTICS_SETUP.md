# Google Analytics Setup Instructions

## Step 1: Create Your Google Analytics Property

1. Go to https://analytics.google.com/
2. Sign in with your Google account
3. Click **"Admin"** (gear icon in the bottom left)
4. Under "Property" column, click **"Create Property"**
5. Enter your property details:
   - Property name: Soft Halo Studio
   - Timezone: Your timezone
   - Currency: USD
6. Click **"Next"**
7. Fill in business information and click **"Create"**
8. Select **"Web"** as the platform
9. Enter your website URL: https://your-domain.com
10. Click **"Create stream"**
11. Copy your **Measurement ID** (format: G-XXXXXXXXXX)

## Step 2: Add Your Measurement ID to the Code

Replace `G-XXXXXXXXXX` with your actual Measurement ID in these two files:

### File 1: index.html (lines 11 and 16)
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID_HERE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ID_HERE');
</script>
```

### File 2: src/App.jsx (line 18)
```javascript
window.gtag('config', 'YOUR_ID_HERE', {
  page_path: location.pathname + location.search,
});
```

## Step 3: Deploy

After replacing the placeholder IDs:
1. Commit your changes: `git add . && git commit -m "Add Google Analytics tracking ID"`
2. Push to GitHub: `git push`
3. Vercel will automatically deploy

## Step 4: Verify

1. Visit your website
2. Go to Google Analytics > Reports > Realtime
3. You should see your visit in real-time!

## What's Tracked

- Page views on all routes (Home, Portfolio, Services, Contact)
- User navigation between pages
- Traffic sources
- User demographics (if enabled in GA settings)
- Session duration

## Privacy Note

Consider adding a cookie consent banner if you're collecting data from EU visitors (GDPR compliance).
