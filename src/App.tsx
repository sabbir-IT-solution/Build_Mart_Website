import React, { useState, useEffect } from 'react';
import { SiteData, ProductItem, QuoteInquiry, CustomerReview, AdminRole } from './types';
import { defaultSiteData, defaultProducts, defaultQuoteInquiries, defaultReviews } from './data/initialData';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CorporateInfo } from './components/CorporateInfo';
import { Products } from './components/Products';
import { ReviewsSection } from './components/ReviewsSection';
import { QuoteForm } from './components/QuoteForm';
import { OwnerSection } from './components/OwnerSection';
import { LocationMap } from './components/LocationMap';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { InquiriesModal } from './components/InquiriesModal';
import { StartupLoader } from './components/StartupLoader';
import { AdminSecurityModal } from './components/AdminSecurityModal';

export default function App() {
  // Startup Loader Active State
  const [showLoader, setShowLoader] = useState(true);

  // Site Data State with LocalStorage Persistence
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem('buildmart_site_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSiteData,
          ...parsed,
        };
      }
      return defaultSiteData;
    } catch {
      return defaultSiteData;
    }
  });

  // Products State
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('buildmart_products');
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  // Quote Inquiries State
  const [inquiries, setInquiries] = useState<QuoteInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('buildmart_inquiries');
      return saved ? JSON.parse(saved) : defaultQuoteInquiries;
    } catch {
      return defaultQuoteInquiries;
    }
  });

  // Customer Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('buildmart_reviews');
      return saved ? JSON.parse(saved) : defaultReviews;
    } catch {
      return defaultReviews;
    }
  });

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [adminRole, setAdminRole] = useState<AdminRole>('developer');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Pre-selected product state for quote form
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Sound Chime for New Quote Alert
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {}
  };

  const prevInquiriesCountRef = React.useRef<number | null>(null);

  // Sync state between client and server on mount & poll for real-time updates
  useEffect(() => {
    let isMounted = true;

    // Request Notification permission if possible
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    const loadData = () => {
      fetch('/api/data')
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch server data');
        })
        .then((data) => {
          if (!isMounted) return;

          if (data.siteData && Object.keys(data.siteData).length > 0) {
            setSiteData(data.siteData);
            try {
              localStorage.setItem('buildmart_site_data', JSON.stringify(data.siteData));
            } catch {}
          }

          if (Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
            try {
              localStorage.setItem('buildmart_products', JSON.stringify(data.products));
            } catch {}
          }

          if (Array.isArray(data.inquiries)) {
            if (
              prevInquiriesCountRef.current !== null &&
              data.inquiries.length > prevInquiriesCountRef.current
            ) {
              playNotificationChime();
              if ('Notification' in window && Notification.permission === 'granted') {
                const latest = data.inquiries[0];
                try {
                  new Notification('🔔 নতুন কোটেশন এসেছে!', {
                    body: `${latest?.name || 'গ্রাহক'} - ${latest?.productName || 'কোটেশন'} (${latest?.phone || ''})`,
                  });
                } catch {}
              }
            }
            prevInquiriesCountRef.current = data.inquiries.length;
            setInquiries(data.inquiries);
            try {
              localStorage.setItem('buildmart_inquiries', JSON.stringify(data.inquiries));
            } catch {}
          }

          if (Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews);
            try {
              localStorage.setItem('buildmart_reviews', JSON.stringify(data.reviews));
            } catch {}
          }
        })
        .catch((err) => {
          console.warn('Could not load from backend server:', err);
        });
    };

    loadData();

    // Auto sync every 3 seconds & when window gets focused
    const interval = setInterval(loadData, 3000);
    window.addEventListener('focus', loadData);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  // Sync to LocalStorage & Backend Server
  useEffect(() => {
    try {
      localStorage.setItem('buildmart_site_data', JSON.stringify(siteData));
    } catch (e) {
      console.warn('LocalStorage save error for siteData:', e);
    }
  }, [siteData]);

  useEffect(() => {
    try {
      localStorage.setItem('buildmart_products', JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage save error for products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('buildmart_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('LocalStorage save error for inquiries:', e);
    }
  }, [inquiries]);

  // Handlers
  const handleOpenAdminClick = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = (token: string, role: AdminRole) => {
    setIsAuthenticated(true);
    setAdminToken(token);
    setAdminRole(role);
    setIsAuthOpen(false);
    setIsAdminOpen(true);
  };

  const handleSaveSiteData = (newSiteData: SiteData) => {
    setSiteData(newSiteData);
    fetch('/api/site-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(newSiteData),
    }).catch((err) => console.error('Failed to sync siteData to server:', err));
  };

  const handleUpdateProducts = (newProducts: ProductItem[]) => {
    setProducts(newProducts);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(newProducts),
    }).catch((err) => console.error('Failed to sync products to server:', err));
  };

  const handleResetDefaults = () => {
    setSiteData(defaultSiteData);
    setProducts(defaultProducts);
    setInquiries(defaultQuoteInquiries);
    setReviews(defaultReviews);
    localStorage.removeItem('buildmart_site_data');
    localStorage.removeItem('buildmart_products');
    localStorage.removeItem('buildmart_inquiries');
    localStorage.removeItem('buildmart_reviews');

    fetch('/api/site-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(defaultSiteData),
    }).catch(() => {});
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(defaultProducts),
    }).catch(() => {});
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultQuoteInquiries),
    }).catch(() => {});
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultReviews),
    }).catch(() => {});
  };

  const handleAddInquiry = (newInquiry: QuoteInquiry) => {
    setInquiries((prev) => {
      const updated = [newInquiry, ...prev];
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch((err) => console.error('Failed to sync inquiry to server:', err));
      return updated;
    });
  };

  const handleAddReview = (newRev: Omit<CustomerReview, 'id' | 'date'>) => {
    const reviewObj: CustomerReview = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => {
      const updated = [reviewObj, ...prev];
      try {
        localStorage.setItem('buildmart_reviews', JSON.stringify(updated));
      } catch {}
      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewObj),
      }).catch((err) => console.error('Failed to sync review:', err));
      return updated;
    });
  };

  const handleUpdateInquiryStatus = (id: string, status: QuoteInquiry['status']) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) => (inq.id === id ? { ...inq, status } : inq));
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
      return updated;
    });
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries((prev) => {
      const updated = prev.filter((inq) => inq.id !== id);
      fetch(`/api/inquiries/${id}`, { method: 'DELETE' }).catch(() => {});
      return updated;
    });
  };

  const handleClearAllInquiries = () => {
    setInquiries([]);
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([]),
    }).catch(() => {});
  };

  const handleSelectProductForQuote = (prod: ProductItem) => {
    setSelectedProduct(prod);
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* Navigation Bar */}
      <Navbar
        siteData={siteData}
        inquiriesCount={inquiries.filter((i) => i.status === 'pending').length}
        onOpenAdmin={handleOpenAdminClick}
        onOpenInquiries={() => setIsInquiriesOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero siteData={siteData} />

        {/* Corporate Profile & Highlights */}
        <CorporateInfo siteData={siteData} />

        {/* Products Catalog */}
        <Products
          products={products}
          onSelectProductForQuote={handleSelectProductForQuote}
        />

        {/* Customer Reviews & Testimonials Section in Card format (Feature #7) */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* Bulk Order / Quote Request Form */}
        <QuoteForm
          siteData={siteData}
          products={products}
          selectedProduct={selectedProduct}
          onAddInquiry={handleAddInquiry}
        />

        {/* Owner Profile Section */}
        <OwnerSection siteData={siteData} />

        {/* Location & Interactive Map */}
        <LocationMap siteData={siteData} />
      </main>

      {/* Footer */}
      <Footer siteData={siteData} onOpenAdmin={handleOpenAdminClick} />

      {/* Admin Password Login Modal */}
      <AdminAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        ownerLogo={siteData.logo}
      />

      {/* Admin Site Editor Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        siteData={siteData}
        onSaveSiteData={handleSaveSiteData}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        onResetDefaults={handleResetDefaults}
        onTestLoaderAnimation={() => setShowLoader(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        role={adminRole}
      />

      <AdminSecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        siteData={siteData}
        authToken={adminToken}
        role={adminRole}
        onCredentialsUpdated={() => {}}
      />

      {/* Quote Inquiries Inbox Modal */}
      <InquiriesModal
        isOpen={isInquiriesOpen}
        onClose={() => setIsInquiriesOpen(false)}
        inquiries={inquiries}
        onUpdateStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        onClearAll={handleClearAllInquiries}
      />

      {/* Startup Liquid Fill Loading Animation */}
      {siteData.enableLoadingAnimation !== false && showLoader && (
        <StartupLoader
          key={siteData.loadingDuration || 2.8}
          siteData={siteData}
          onComplete={() => setShowLoader(false)}
        />
      )}
    </div>
  );
}
