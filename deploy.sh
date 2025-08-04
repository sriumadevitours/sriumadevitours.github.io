#!/bin/bash

echo "🕉️ Deploying Sri Umadevi Tours to GitHub Pages..."

# Check if this is already a git repository
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "🕉️ Sri Umadevi Tours - Divine Spiritual Journeys

✨ Features:
• Kailash Manasarovar Yatra (₹2,35,000) - 14 days
• Premium Helicopter Kailash (₹2,95,000) - 11 days  
• Chardham Yatra (₹65,000) - 12 days
• Sacred Temple Tours (₹35,000) - 8 days

📱 WhatsApp Booking: +91 95816 08979
📍 Skandagiri, Padmarao Nagar, Secunderabad
🎨 Responsive design with real spiritual imagery
💬 Floating WhatsApp integration

🚀 Generated with Claude Code"
fi

echo "📝 Repository ready for GitHub Pages!"
echo ""
echo "🌐 To deploy to GitHub Pages:"
echo "1. Create repository 'sriumadevitours' on GitHub (public)"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/sriumadevitours.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages in Settings → Pages → main branch"
echo "4. Your site will be live at: https://YOUR_USERNAME.github.io/sriumadevitours/"
echo ""
echo "⚡ Quick test locally: python3 -m http.server 8000"