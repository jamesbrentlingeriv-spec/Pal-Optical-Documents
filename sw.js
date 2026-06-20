const CACHE_NAME = 'pal-optical-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/src/app.js',
  '/src/components/Sidebar.js',
  '/src/components/FormActions.js',
  '/src/components/SignaturePad.js',
  '/src/styles/main.css',
  '/src/styles/forms.css',
  '/src/styles/replicas.css',
  '/src/styles/print.css',
  '/cms1500-form.pdf',
  '/safety_order_form.pdf',
  '/quote.pdf',
  '/Printable%20Patient%20Form.pdf',
  '/PD%20FORM.pdf',
  '/default_signature.png',
  '/jamessig.jpg',
  '/CARRIBYAN%20SIG.jpg',
  '/src/forms/CMS1500Form.js',
  '/src/forms/ChildNoPolyForm.js',
  '/src/forms/DrSideNewPatientForm.js',
  '/src/forms/ExpiredRxForm.js',
  '/src/forms/FeeSlipForm.js',
  '/src/forms/FrameNoChildForm.js',
  '/src/forms/PDForm.js',
  '/src/forms/PatientInfoForm.js',
  '/src/forms/PatientsOwnFrameForm.js',
  '/src/forms/PriceQuoteForm.js',
  '/src/forms/PriorAuthForm.js',
  '/src/forms/SafetyOrderForm.js',
  '/src/forms/SemiRimlessWaiverForm.js',
  '/src/forms/SingleVisionConsentForm.js',
  '/src/forms/SchoolExcuseForm.js',
  '/src/forms/cms1500_fields.json',
  '/src/forms/fee_slip_fields.json',
  '/src/forms/safety_fields.json',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
];

// 1. Install event: Pre-cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Pre-caching assets...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: Stale-While-Revalidate caching strategy
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests (e.g. POST for third-party scripts)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache the new response if valid
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.log('Fetch failed, falling back to cache if available', err);
      });

      // Return cached version immediately if found, otherwise wait for network fetch
      return cachedResponse || fetchPromise;
    })
  );
});
