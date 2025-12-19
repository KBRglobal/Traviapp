#!/bin/bash
# Script to safely sync Replit with GitHub fixes
# שורה כדי לסנכרן בבטחה עם התיקונים מ-GitHub

echo "🔍 בודק מצב נוכחי..."
git status

echo ""
echo "📥 מושך שינויים מ-GitHub..."
git fetch origin

echo ""
echo "🔀 עובר לבranch עם כל התיקונים..."
git checkout claude/check-errors-fixes-D9VNW

echo ""
echo "⬇️ מוריד את כל התיקונים..."
git pull origin claude/check-errors-fixes-D9VNW

echo ""
echo "✅ סיימתי! בדיקה אחרונה:"
git log --oneline -5

echo ""
echo "📊 מצב סופי:"
git status

echo ""
echo "🎉 עכשיו יש לך את כל התיקונים!"
echo "הקבצים שתוקנו:"
echo "  ✓ client/src/components/hotel-seo-editor.tsx"
echo "  ✓ client/src/components/dining-seo-editor.tsx"
echo "  ✓ client/src/components/district-seo-editor.tsx"
echo "  ✓ client/src/pages/content-editor.tsx"
echo "  ✓ QA_AUDIT_REPORT_COMPLETE.md (44/44 ✅)"
