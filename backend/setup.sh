#!/bin/bash

# Chapter - Setup Script for Termux

echo "╔════════════════════════════════════════════════════════╗"
echo "║     📦 Chapter Server - Termux Setup Script 📦         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# التحقق من تثبيت Node.js
if ! command -v node &> /dev/null; then
    echo "⏳ جاري تثبيت Node.js..."
    pkg update -y
    pkg install -y nodejs
    echo "✅ تم تثبيت Node.js"
else
    echo "✅ Node.js مثبت بالفعل: $(node -v)"
fi

# التحقق من تثبيت npm
if ! command -v npm &> /dev/null; then
    echo "⏳ جاري تثبيت npm..."
    pkg install -y npm
    echo "✅ تم تثبيت npm"
else
    echo "✅ npm مثبت بالفعل: $(npm -v)"
fi

# الانتقال إلى مجلد backend
cd "$(dirname "$0")" || exit

# تثبيت المكتبات
echo ""
echo "⏳ جاري تثبيت المكتبات المطلوبة..."
npm install

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ التثبيت اكتمل بنجاح! ✅               ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║                                                        ║"
echo "║  لتشغيل السيرفر اكتب:                                 ║"
echo "║                                                        ║"
echo "║  npm start                                             ║"
echo "║                                                        ║"
echo "║  أو                                                   ║"
echo "║                                                        ║"
echo "║  node server.js                                        ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
