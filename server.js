/* MR SMILEY Portfolio - Backend Server */
/* Complete Express Server with API Endpoints and Image Upload */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// Configuration
// ======================
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const GALLERY_UPLOADS_DIR = path.join(__dirname, 'uploads', 'gallery');
const VIDEO_UPLOADS_DIR = path.join(__dirname, 'uploads', 'videos');

// Create directories if they don't exist
[DATA_DIR, UPLOADS_DIR, GALLERY_UPLOADS_DIR, VIDEO_UPLOADS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ======================
// Middleware
// ======================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Serve uploads folder
app.use('/uploads', express.static(UPLOADS_DIR));

// ======================
// Multer Configuration for Image Upload
// ======================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadType = req.uploadType || 'gallery';
        const dest = uploadType === 'gallery' ? GALLERY_UPLOADS_DIR : UPLOADS_DIR;
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// ======================
// Multer Configuration for Video Upload
// ======================
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, VIDEO_UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'video-' + uniqueSuffix + ext);
    }
});

const videoFilter = (req, file, cb) => {
    const allowedTypes = /mp4|webm|mov|avi|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype.split('/')[0]);
    
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
    fileFilter: videoFilter
});

// ======================
// Helper Functions
// ======================
function readJsonFile(filename) {
    const filepath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filepath)) {
        try {
            return JSON.parse(fs.readFileSync(filepath, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

function writeJsonFile(filename, data) {
    const filepath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function generateId() {
    return 'MR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ======================
// API Routes
// ======================

// 1. Contact Form
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }

        const contacts = readJsonFile('contacts.json');
        const newContact = {
            id: generateId(),
            name,
            email,
            subject: subject || 'General',
            message,
            date: new Date().toISOString(),
            status: 'new'
        };
        
        contacts.push(newContact);
        writeJsonFile('contacts.json', contacts);

        console.log('📧 New Contact:', newContact);

        res.json({ 
            success: true, 
            message: 'Message sent successfully!',
            contactId: newContact.id
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 2. Booking Form
app.post('/api/booking', (req, res) => {
    try {
        const { name, email, phone, service, package: packageType, date, message } = req.body;
        
        if (!name || !email || !phone || !service || !packageType || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }

        const bookings = readJsonFile('bookings.json');
        const newBooking = {
            id: generateId(),
            bookingId: 'BK-' + Date.now(),
            name,
            email,
            phone,
            service,
            package: packageType,
            date,
            message: message || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        bookings.push(newBooking);
        writeJsonFile('bookings.json', bookings);

        console.log('📅 New Booking:', newBooking);

        res.json({ 
            success: true, 
            message: 'Booking confirmed!',
            bookingId: newBooking.bookingId
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 3. Payment Processing
app.post('/api/payment', (req, res) => {
    try {
        const { cardName, cardNumber, expiry, cvv, amount } = req.body;
        
        if (!cardName || !cardNumber || !expiry || !cvv || !amount) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all payment details' 
            });
        }

        // In production, integrate with Stripe, PayPal, or other payment gateways
        // This is a demo implementation
        const payments = readJsonFile('payments.json');
        const newPayment = {
            id: generateId(),
            transactionId: 'TXN-' + Date.now(),
            cardName,
            cardNumber: '****' + cardNumber.slice(-4),
            amount: parseFloat(amount),
            status: 'completed',
            date: new Date().toISOString()
        };
        
        payments.push(newPayment);
        writeJsonFile('payments.json', payments);

        console.log('💳 New Payment:', newPayment.transactionId);

        res.json({ 
            success: true, 
            message: 'Payment successful!',
            transactionId: newPayment.transactionId
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ success: false, message: 'Payment failed' });
    }
});

// 4. Newsletter Subscription
app.post('/api/subscribe', (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide your email address' 
            });
        }

        const subscribers = readJsonFile('subscribers.json');
        
        // Check if already subscribed
        const existing = subscribers.find(s => s.email === email);
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'This email is already subscribed!' 
            });
        }

        const newSubscriber = {
            id: generateId(),
            email,
            subscribedAt: new Date().toISOString(),
            status: 'active'
        };
        
        subscribers.push(newSubscriber);
        writeJsonFile('subscribers.json', subscribers);

        console.log('📰 New Subscriber:', email);

        res.json({ 
            success: true, 
            message: 'Thank you for subscribing!' 
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ success: false, message: 'Subscription failed' });
    }
});

// 5. Private Gallery Access
app.post('/api/gallery/access', (req, res) => {
    try {
        const { accessCode } = req.body;
        
        if (!accessCode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter access code' 
            });
        }

        const galleries = readJsonFile('galleries.json');
        
        // Check if valid gallery code
        const gallery = galleries.find(g => g.code === accessCode && g.status === 'active');
        
        if (gallery) {
            // Log access
            console.log('🔐 Gallery accessed:', gallery.clientName);
            
            res.json({ 
                success: true, 
                message: 'Access granted!',
                gallery: {
                    id: gallery.id,
                    clientName: gallery.clientName,
                    accessCode: gallery.code
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid access code' 
            });
        }
    } catch (error) {
        console.error('Gallery access error:', error);
        res.status(500).json({ success: false, message: 'Access denied' });
    }
});

// 6. Image Upload (Gallery Images)
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No image uploaded' 
            });
        }

        const uploads = readJsonFile('uploads.json');
        const newUpload = {
            id: generateId(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: '/uploads/gallery/' + req.file.filename,
            size: req.file.size,
            uploadedAt: new Date().toISOString()
        };
        
        uploads.push(newUpload);
        writeJsonFile('uploads.json', uploads);

        console.log('📷 Image uploaded:', req.file.filename);

        res.json({ 
            success: true, 
            message: 'Image uploaded successfully!',
            image: newUpload
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// 7. Multiple Image Upload
app.post('/api/upload/multiple', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No images uploaded' 
            });
        }

        const uploads = readJsonFile('uploads.json');
        const newUploads = req.files.map(file => ({
            id: generateId(),
            filename: file.filename,
            originalName: file.originalname,
            path: '/uploads/gallery/' + file.filename,
            size: file.size,
            uploadedAt: new Date().toISOString()
        }));
        
        uploads.push(...newUploads);
        writeJsonFile('uploads.json', uploads);

        console.log('📷 Multiple images uploaded:', req.files.length);

        res.json({ 
            success: true, 
            message: `${req.files.length} images uploaded successfully!`,
            images: newUploads
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// 8. Get All Gallery Images
app.get('/api/gallery/images', (req, res) => {
    try {
        const uploads = readJsonFile('uploads.json');
        res.json({ success: true, images: uploads });
    } catch (error) {
        console.error('Get images error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch images' });
    }
});

// 9. Delete Gallery Image
app.delete('/api/gallery/images/:id', (req, res) => {
    try {
        const { id } = req.params;
        const uploads = readJsonFile('uploads.json');
        const imageIndex = uploads.findIndex(u => u.id === id);
        
        if (imageIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Image not found' 
            });
        }

        const image = uploads[imageIndex];
        
        // Delete file from disk
        const filepath = path.join(GALLERY_UPLOADS_DIR, image.filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        // Remove from database
        uploads.splice(imageIndex, 1);
        writeJsonFile('uploads.json', uploads);

        res.json({ success: true, message: 'Image deleted' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// 10. Video Upload
app.post('/api/upload/video', uploadVideo.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No video uploaded' 
            });
        }

        const videos = readJsonFile('videos.json');
        const newVideo = {
            id: generateId(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: '/uploads/videos/' + req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString()
        };
        
        videos.push(newVideo);
        writeJsonFile('videos.json', videos);

        console.log('🎬 Video uploaded:', req.file.filename);

        res.json({ 
            success: true, 
            message: 'Video uploaded successfully!',
            video: newVideo
        });
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ success: false, message: 'Video upload failed' });
    }
});

// 11. Get All Videos
app.get('/api/gallery/videos', (req, res) => {
    try {
        const videos = readJsonFile('videos.json');
        res.json({ success: true, videos: videos });
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch videos' });
    }
});

// 12. Delete Video
app.delete('/api/gallery/videos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const videos = readJsonFile('videos.json');
        const videoIndex = videos.findIndex(v => v.id === id);
        
        if (videoIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Video not found' 
            });
        }

        const video = videos[videoIndex];
        
        // Delete file from disk
        const filepath = path.join(VIDEO_UPLOADS_DIR, video.filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        // Remove from database
        videos.splice(videoIndex, 1);
        writeJsonFile('videos.json', videos);

        res.json({ success: true, message: 'Video deleted' });
    } catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

// 13. Get All Media (Images + Videos combined)
app.get('/api/gallery/media', (req, res) => {
    try {
        const uploads = readJsonFile('uploads.json');
        const videos = readJsonFile('videos.json');
        
        // Add type to each item
        const images = uploads.map(img => ({ ...img, type: 'image' }));
        const videoList = videos.map(vid => ({ ...vid, type: 'video' }));
        
        // Combine and sort by upload date
        const media = [...images, ...videoList].sort((a, b) => 
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
        );
        
        res.json({ success: true, media: media });
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch media' });
    }
});

// ======================
// Admin Routes (for viewing data)
// ======================
app.get('/api/admin/contacts', (req, res) => {
    const contacts = readJsonFile('contacts.json');
    res.json(contacts);
});

app.get('/api/admin/bookings', (req, res) => {
    const bookings = readJsonFile('bookings.json');
    res.json(bookings);
});

app.get('/api/admin/subscribers', (req, res) => {
    const subscribers = readJsonFile('subscribers.json');
    res.json(subscribers);
});

// ======================
// Serve Frontend
// ======================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ======================
// Error Handling
// ======================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🎬 MR SMILEY Portfolio Server');
    console.log('='.repeat(50));
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${UPLOADS_DIR}`);
    console.log(`📷 Images directory: ${GALLERY_UPLOADS_DIR}`);
    console.log(`🎬 Videos directory: ${VIDEO_UPLOADS_DIR}`);
    console.log('='.repeat(50));
    console.log('📡 API Endpoints:');
    console.log(`   POST /api/contact - Contact form`);
    console.log(`   POST /api/booking - Booking form`);
    console.log(`   POST /api/payment - Payment processing`);
    console.log(`   POST /api/subscribe - Newsletter`);
    console.log(`   POST /api/upload - Single image upload`);
    console.log(`   POST /api/upload/multiple - Multiple images upload`);
    console.log(`   POST /api/upload/video - Video upload`);
    console.log(`   GET  /api/gallery/images - Get all images`);
    console.log(`   GET  /api/gallery/videos - Get all videos`);
    console.log(`   GET  /api/gallery/media - Get all media`);
    console.log('='.repeat(50));
});

module.exports = app;

