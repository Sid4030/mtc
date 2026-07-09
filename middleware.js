export const config = {
  // Apply middleware to all routes except static assets
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (if you want api to be excluded, or remove to include)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// Simple in-memory store for rate limiting (local to the Edge function instance)
// Note: While not globally synced across regions, it absorbs localized bursts effectively.
const ipCache = new Map();

export default function middleware(request) {
  const url = new URL(request.url);
  
  // 1. Basic Bot Management: Block requests with no User-Agent or known scraper user-agents
  const userAgent = request.headers.get('user-agent') || '';
  const blockedAgents = ['curl', 'python-requests', 'wget', 'postman', 'bot', 'scraper', 'spider'];
  
  if (!userAgent || blockedAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return new Response(JSON.stringify({ error: 'Automated requests are blocked.' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 2. IP Address Rate Limiting (Protects the backend from unusual traffic)
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1-minute time window
  const maxRequests = 60; // Allow 60 requests per minute per IP (plenty for real users)
  
  if (ip !== 'unknown') {
    const record = ipCache.get(ip) || { count: 0, startTime: now };
    
    // Reset window if 1 minute has passed
    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
    } else {
      record.count += 1;
    }
    
    ipCache.set(ip, record);
    
    // Memory cleanup: 5% chance on each request to clear old IP records
    if (Math.random() < 0.05) {
      for (const [key, value] of ipCache.entries()) {
        if (now - value.startTime > windowMs) {
          ipCache.delete(key);
        }
      }
    }
    
    // Block the IP if it exceeds the maxRequests limit
    if (record.count > maxRequests) {
      return new Response(JSON.stringify({ error: 'Too many requests detected. Please slow down.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((windowMs - (now - record.startTime)) / 1000).toString(),
        },
      });
    }
  }

  // Continue to origin if all checks pass
  // The Vercel Edge Network inherently acts as an Origin Shield here.
}
