// Listenr GA4 integration. The Measurement ID is configured in app.html.
(function () {
  'use strict';

  const meta = document.querySelector('meta[name="listenr-ga4-id"]');
  const measurementId = meta ? meta.content.trim().toUpperCase() : '';
  const validId = /^G-[A-Z0-9]+$/.test(measurementId);
  let previousLocation = '';
  let initialized = false;

  window.listenrAnalytics = {
    enabled: false,
    trackPage: function () {},
    trackEvent: function () {}
  };

  function initialize() {
    if (initialized || !validId || location.protocol === 'file:') return;
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
    window.listenrAnalytics.enabled = true;
  }

  window.listenrAnalytics.trackPage = function (view, title) {
    if (!initialized) return;
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('view', view);
    const pageLocation = url.href;
    const params = {
      page_title: title,
      page_location: pageLocation
    };
    if (previousLocation) params.page_referrer = previousLocation;
    window.gtag('event', 'page_view', params);
    previousLocation = pageLocation;
  };

  window.listenrAnalytics.trackEvent = function (name, params) {
    if (!initialized) return;
    window.gtag('event', name, params || {});
  };

  initialize();
})();
