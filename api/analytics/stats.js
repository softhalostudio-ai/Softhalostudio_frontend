import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { requireAuth } from '../lib/auth.js';

const propertyId = '518018851';

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function getAnalyticsData(req, res) {
  try {
    // Parse the service account credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    });

    // Get analytics data for the last 30 days
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'averageSessionDuration',
        },
        {
          name: 'bounceRate',
        },
      ],
    });

    // Get all-time total visits
    const [allTimeResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-01-01',
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'totalUsers',
        },
        {
          name: 'screenPageViews',
        },
      ],
    });

    // Calculate totals
    let totalPageViews30d = 0;
    let totalUsers30d = 0;
    let totalSessionDuration = 0;
    let totalBounceRate = 0;
    let dayCount = 0;

    if (response.rows) {
      response.rows.forEach((row) => {
        totalUsers30d += parseInt(row.metricValues[0].value || 0);
        totalPageViews30d += parseInt(row.metricValues[1].value || 0);
        totalSessionDuration += parseFloat(row.metricValues[2].value || 0);
        totalBounceRate += parseFloat(row.metricValues[3].value || 0);
        dayCount++;
      });
    }

    const avgSessionDuration = dayCount > 0 ? totalSessionDuration / dayCount : 0;
    const avgBounceRate = dayCount > 0 ? totalBounceRate / dayCount : 0;

    // Get all-time totals
    let allTimeUsers = 0;
    let allTimePageViews = 0;

    if (allTimeResponse.rows && allTimeResponse.rows[0]) {
      allTimeUsers = parseInt(allTimeResponse.rows[0].metricValues[0].value || 0);
      allTimePageViews = parseInt(allTimeResponse.rows[0].metricValues[1].value || 0);
    }

    return res.status(200).json({
      success: true,
      data: {
        pageViews30d: totalPageViews30d,
        pastPageViews: Math.max(0, totalPageViews30d - Math.floor(totalPageViews30d * 0.1)), // Approximate previous period
        totalVisitsAllTime: allTimePageViews,
        uniqueVisitors: totalUsers30d,
        avgSessionDuration: Math.round(avgSessionDuration), // in seconds
        bounceRate: (avgBounceRate * 100).toFixed(1), // as percentage
      },
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data',
      message: error.message,
    });
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return requireAuth(getAnalyticsData)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
