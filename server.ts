import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Persistent JSON Database path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial data fallback
const defaultSiteData = {
  brandName: 'কবীর এন্টারপ্রাইজ (KABIR ENTERPRISES)',
  phone: '01700-000000',
  address: 'খুলনা, বাংলাদেশ',
  email: 'info@kabirenterprises.com',
  heroBadge: 'বিশ্বস্ততা আমাদের শক্তি, মান আমাদের প্রতিশ্রুতি',
  heroTitle: 'কবীর এন্টারপ্রাইজ',
  heroText: 'ইট | বালি | রড | সিমেন্ট — পাইকারি ও খুচরা বিক্রেতা (Wholesalers & Retailers)',
  ownerName: 'কবীর হোসেন',
  ownerTitle: 'Owner & স্বত্বাধিকারী',
  ownerIntro: 'বিশ্বস্ততা ও সুদীর্ঘ অভিজ্ঞতার সাথে খুলনা ও দেশজুড়ে সর্বোচ্চ মানের রড, সিমেন্ট, বালি, ইট ও সেরা নির্মাণ সামগ্রী সরবরাহ করে আসছি।',
  logo: '/kabir-logo.jpg',
  ownerPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  heroBgImage: '/kabir-banner.jpg',
  adminUsername: 'kabir',
  adminPassword: 'admin123',
  developerUsername: 'sabbir',
  developerPassword: '0000',
  adminRecoveryKey: '',
  devBrandName: 'Sabbir IT & Web Solutions',
  devLogo: '',
  devTagline: 'ওয়েবসাইট ডিজাইনার ও প্রফেশনাল ডেভেলপমেন্ট',
  devWebsiteUrl: '',
  devPhone: '01700-000000',
  telegramBotToken: '',
  telegramChatId: '',
};

const defaultProducts = [
  {
    id: 'prod-1',
    name: 'BSRM 500D Xtreme MS Rod',
    category: 'rod',
    description: 'সর্বোচ্চ গ্রেডের বিএসআরএম ৫০০ডি এক্সট্রিম রড। ভূমিকম্প সহনশীল ও দীর্ঘস্থায়ী।',
    unitPrice: 94500,
    unit: 'টন',
    minOrder: '১ টন',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-2',
    name: 'AKS 500W Deformed Bar',
    category: 'rod',
    description: 'আবুল খায়ের স্টিল (একেএস) ৫০০ ডব্লিউ উচ্চমানের এমএস রড।',
    unitPrice: 92000,
    unit: 'টন',
    minOrder: '১ টন',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-3',
    name: 'Shah Cement OPC Premium',
    category: 'cement',
    description: 'শাহ সিমেন্ট ওপিসি প্রিমিয়াম গ্রেড। দ্রুত জমাট বাঁধা ও শক্ত বাঁধুনির জন্য সেরা।',
    unitPrice: 560,
    unit: 'ব্যাগ',
    minOrder: '৫০ ব্যাগ',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-4',
    name: 'Bashundhara PCC Cement',
    category: 'cement',
    description: 'বসুন্ধরা পোর্টল্যান্ড পোজোলানা সিমেন্ট (পিসিসি)। দীর্ঘমেয়াদী স্থায়িত্ব।',
    unitPrice: 530,
    unit: 'ব্যাগ',
    minOrder: '৫০ ব্যাগ',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-5',
    name: 'সিলেট লাল মোটা বালি (FM 2.5)',
    category: 'sand',
    description: 'উচ্চমানের সিলেট মোটা বালি। ছাদ ঢালাই ও পিলারের জন্য আদর্শ।',
    unitPrice: 65,
    unit: 'সিএফটি',
    minOrder: '২০০ সিএফটি',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-6',
    name: '১ম শ্রেণীর ইটের অটো ব্রিকস (Auto Brick)',
    category: 'brick',
    description: 'স্বয়ংক্রিয় মেশিনে তৈরি সঠিক সাইজ ও পরিমাপের ১ম শ্রেণীর ইট।',
    unitPrice: 13500,
    unit: 'হাজার (১০০০ টি)',
    minOrder: '২ হাজার',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-7',
    name: 'ভোলাগঞ্জ পাথর (Stone Chips 3/4")',
    category: 'sand',
    description: 'সিলেট ভোলাগঞ্জের ৩/৪ ইঞ্চি পেষা পাথর। সর্বোচ্চ লোড ধারণ ক্ষমতা।',
    unitPrice: 180,
    unit: 'সিএফটি',
    minOrder: '১০০ সিএফটি',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'prod-8',
    name: 'জি আই বাইন্ডিং ওয়ার (G.I Wire)',
    category: 'other',
    description: 'জিআই বাইন্ডিং তার। রড বাঁধার জন্য নিখুঁত ও মরিচারোধক।',
    unitPrice: 120,
    unit: 'কেজি',
    minOrder: '১০ কেজি',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
  },
];

const defaultInquiries = [
  {
    id: 'inq-101',
    date: '২০২৬-০৭-২৫',
    name: 'ইঞ্জিনিয়ার রফিকুল ইসলাম',
    phone: '01812-345678',
    address: 'উত্তরা সেক্টর ১০, ঢাকা',
    productName: 'BSRM 500D Xtreme MS Rod',
    quantity: '৫ টন',
    estimatedCost: 472500,
    note: 'আগামী সোমবার সকালে সাইটে ডেলিভারি প্রয়োজন।',
    status: 'contacted',
  },
];

const defaultReviews = [
  {
    id: 'rev-1',
    name: 'ইঞ্জিনিয়ার আরিফুর রহমান',
    roleOrLocation: 'কনস্ট্রাকশন ম্যানেজার, সোনাডাঙ্গা প্রজেক্ট',
    rating: 5,
    comment: 'কবীর এন্টারপ্রাইজ থেকে আমরা বিএসআরএম রড ও শাহ সিমেন্ট পাইকারি দামে নিয়েছি। ডেলিভারি টাইমিং এবং মালামালের কোয়ালিটি অত্যন্ত প্রশংসনীয়। ধন্যবাদ কবীর ভাইকে!',
    date: '২০২৬-০৭-১৫',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'মোঃ জহিরুল ইসলাম',
    roleOrLocation: 'বাসার মালিক, রূপসা, খুলনা',
    rating: 5,
    comment: 'নিজের ৪ তলা বিল্ডিংয়ের জন্য সিলেট বালি এবং ১ নম্বর ইট অর্ডার করেছিলাম। ওজনে বা মাপে কোনো কম ছিল না। বাজারে সেরা দামে পেয়েছি।',
    date: '২০২৬-০৭-২০',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'ঠিকাদার শফিকুল আলম',
    roleOrLocation: 'বিল্ডিং কন্ট্রাক্টর, দৌলতপুর',
    rating: 5,
    comment: 'সাইটে ইমার্জেন্সি মালামাল লাগবে বললেই কয়েক ঘণ্টার মধ্যে ট্রাকে করে পৌছে দেন। দীর্ঘ ৩ বছর ধরে উনাদের সাথে কাজ করছি, সার্ভিস দারুণ!',
    date: '২০২৬-০৭-২৫',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'প্রকৌশলী সাজ্জাদ হোসেন',
    roleOrLocation: 'স্ট্রাকচারাল কনসালট্যান্ট, খুলনা',
    rating: 5,
    comment: 'বিল্ডিং নির্মাণের মূল চাবিকাঠি হলো খাঁটি মানের কাঁচামাল। কবীর এন্টারপ্রাইজের প্রতিটি রড ও সিমেন্ট ১০০% অরিজিনাল টেস্টেড।',
    date: '২০২৬-০৭-২৭',
    verified: true,
  },
];

interface DatabaseSchema {
  siteData: typeof defaultSiteData;
  products: typeof defaultProducts;
  inquiries: typeof defaultInquiries;
  reviews: typeof defaultReviews;
}

// Initialize / Load database
function loadDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8').trim();
      if (raw.length > 0) {
        const parsed = JSON.parse(raw);
        return {
          siteData: parsed.siteData || defaultSiteData,
          products: parsed.products || defaultProducts,
          inquiries: parsed.inquiries || defaultInquiries,
          reviews: parsed.reviews || defaultReviews,
        };
      }
    }
  } catch (err) {
    console.error('Failed to load DB, resetting to defaults:', err);
  }
  const initDb: DatabaseSchema = {
    siteData: defaultSiteData,
    products: defaultProducts,
    inquiries: defaultInquiries,
    reviews: defaultReviews,
  };
  saveDb(initDb);
  return initDb;
}

function saveDb(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

let db = loadDb();

const adminSessions = new Map<string, { expiresAt: number; role: 'owner' | 'developer' }>();

function requireAdmin(req: express.Request, res: express.Response, ownerOnly = false) {
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');
  const session = token ? adminSessions.get(token) : undefined;
  if (!session || session.expiresAt < Date.now()) {
    if (token) adminSessions.delete(token);
    res.status(401).json({ error: 'সেশন শেষ হয়েছে। আবার লগইন করুন।' });
    return false;
  }
  if (ownerOnly && session.role !== 'owner') {
    res.status(403).json({ error: 'এই কাজটি শুধু Owner account থেকে করা যাবে।' });
    return false;
  }
  (req as express.Request & { adminRole?: 'owner' | 'developer' }).adminRole = session.role;
  return true;
}

// API Routes
app.get('/api/data', (_req, res) => {
  const { adminPassword, adminUsername, developerUsername, developerPassword, adminRecoveryKey, ...publicSiteData } = db.siteData;
  res.json({ ...db, siteData: publicSiteData });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const role = username === (db.siteData.adminUsername || 'kabir') && password === (db.siteData.adminPassword || 'admin123') ? 'owner' : username === (db.siteData.developerUsername || 'sabbir') && password === (db.siteData.developerPassword || '0000') ? 'developer' : null;
  if (role) {
    const token = crypto.randomBytes(32).toString('hex');
    adminSessions.set(token, { role, expiresAt: Date.now() + 4 * 60 * 60_000 });
    return res.json({ success: true, token, role });
  }
  return res.status(401).json({ error: 'ভুল ইউজারনেম বা পাসওয়ার্ড।' });
});

app.post('/api/admin/reset-password', (req, res) => {
  const { username, password, recoveryKey } = req.body || {};
  if (!username?.trim() || !password || password.length < 6) {
    return res.status(400).json({ error: 'ইউজারনেম ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' });
  }
  if (!db.siteData.adminRecoveryKey || recoveryKey !== db.siteData.adminRecoveryKey || username.trim() !== (db.siteData.adminUsername || 'kabir')) {
    return res.status(401).json({ error: 'Recovery Key ভুল।' });
  }
  db.siteData.adminPassword = password;
  saveDb(db);
  return res.json({ success: true });
});

app.post('/api/admin/update-credentials', (req, res) => {
  if (!requireAdmin(req, res, true)) return;
  const { username, password, recoveryKey } = req.body || {};
  if (!username?.trim() || !password || password.length < 6) {
    return res.status(400).json({ error: 'ইউজারনেম ও কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' });
  }
  db.siteData.adminUsername = username.trim();
  db.siteData.adminPassword = password;
  if (recoveryKey?.trim()) db.siteData.adminRecoveryKey = recoveryKey.trim();
  saveDb(db);
  return res.json({ success: true, adminUsername: db.siteData.adminUsername, adminPassword: db.siteData.adminPassword });
});

app.post('/api/developer/update-credentials', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const role = (req as express.Request & { adminRole?: 'owner' | 'developer' }).adminRole;
  if (role !== 'developer') return res.status(403).json({ error: 'শুধু Developer নিজের password পরিবর্তন করতে পারবেন।' });
  const { password } = req.body || {};
  if (!password || password.length < 4) return res.status(400).json({ error: 'কমপক্ষে ৪ অক্ষরের password দিন।' });
  db.siteData.developerPassword = password;
  saveDb(db);
  return res.json({ success: true });
});

app.post('/api/site-data', (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (req.body) {
    const { adminPassword, adminUsername, developerUsername, developerPassword, adminPhone, adminRecoveryKey, telegramBotToken, telegramChatId, ...safeSiteData } = req.body;
    const role = (req as express.Request & { adminRole?: 'owner' | 'developer' }).adminRole;
    const developerFields = (({ devBrandName, devTagline, devWebsiteUrl, devPhone, devLogo, loadingTitle, loadingLogo, loadingBgColor, loadingAccentColor, loadingDuration, enableLoadingAnimation }) => ({ devBrandName, devTagline, devWebsiteUrl, devPhone, devLogo, loadingTitle, loadingLogo, loadingBgColor, loadingAccentColor, loadingDuration, enableLoadingAnimation }))(safeSiteData);
    db.siteData = role === 'developer'
      ? { ...db.siteData, ...developerFields }
      : { ...db.siteData, ...safeSiteData, telegramBotToken, telegramChatId };
    saveDb(db);
    res.json({ success: true, siteData: db.siteData });
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.post('/api/products', (req, res) => {
  if (!requireAdmin(req, res, true)) return;
  if (Array.isArray(req.body)) {
    db.products = req.body;
    saveDb(db);
    res.json({ success: true, products: db.products });
  } else {
    res.status(400).json({ error: 'Expected products array' });
  }
});

// Function to send automated Telegram Push Notification to owner's phone
async function notifyOwnerTelegram(inquiry: any, siteData: any) {
  try {
    const token = siteData?.telegramBotToken;
    const chatId = siteData?.telegramChatId;
    if (!token || !chatId) return;

    const message = `🔔 *নতুন কোটেশন রিকোয়েস্ট এসেছে!*

👤 *নাম:* ${inquiry.name || 'অজ্ঞাত'}
📱 *ফোন:* ${inquiry.phone || 'নেই'}
📦 *পণ্য:* ${inquiry.productName || 'সাধারণ কোটেশন'}
🔢 *পরিমাণ:* ${inquiry.quantity || 'প্রয়োজন অনুযায়ী'}
💰 *আনুমানিক বাজেট:* ৳ ${inquiry.estimatedCost ? Number(inquiry.estimatedCost).toLocaleString('bn-BD') : 'আলোচনা সাপেক্ষে'}
📍 *ঠিকানা:* ${inquiry.address || 'নেই'}
📝 *বার্তা:* ${inquiry.note || 'নেই'}
📅 *তারিখ:* ${inquiry.date || new Date().toISOString().split('T')[0]}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}

app.post('/api/inquiries', (req, res) => {
  if (req.body) {
    let newInq: any = null;
    if (Array.isArray(req.body)) {
      // If array posted, check if the first item is a new inquiry compared to current db
      if (req.body.length > db.inquiries.length) {
        newInq = req.body[0];
      }
      db.inquiries = req.body;
    } else {
      newInq = req.body;
      db.inquiries = [req.body, ...db.inquiries];
    }
    saveDb(db);

    // Trigger Telegram push alert if new inquiry exists
    if (newInq) {
      notifyOwnerTelegram(newInq, db.siteData);
    }

    res.json({ success: true, inquiries: db.inquiries });
  } else {
    res.status(400).json({ error: 'Invalid inquiry data' });
  }
});

app.delete('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  db.inquiries = db.inquiries.filter((inq) => inq.id !== id);
  saveDb(db);
  res.json({ success: true, inquiries: db.inquiries });
});

app.post('/api/reviews', (req, res) => {
  if (req.body) {
    if (Array.isArray(req.body)) {
      db.reviews = req.body;
    } else {
      db.reviews = [req.body, ...db.reviews];
    }
    saveDb(db);
    res.json({ success: true, reviews: db.reviews });
  } else {
    res.status(400).json({ error: 'Invalid review data' });
  }
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.reviews = db.reviews.filter((rev) => rev.id !== id);
  saveDb(db);
  res.json({ success: true, reviews: db.reviews });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
