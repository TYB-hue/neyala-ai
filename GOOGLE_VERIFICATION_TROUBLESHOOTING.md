# حل مشكلة التحقق من Google Search Console

## المشكلة
"تعذّر العثور على موقعك" - Google لا يستطيع الوصول إلى الموقع

## الحلول الممكنة

### 1. التحقق من عنوان URL في Google Search Console

تأكد من أن عنوان URL الذي أدخلته في Google Search Console صحيح:

✅ **صحيح:**
- `https://nyala.my.to`
- `https://www.nyala.my.to` (إذا كان لديك www)

❌ **خاطئ:**
- `http://nyala.my.to` (بدون https)
- `nyala.my.to` (بدون https://)
- `http://localhost:3000`

### 2. التحقق من أن الموقع متاح للجمهور

تأكد من أن الموقع يعمل ويمكن الوصول إليه:
```bash
# اختبر الموقع
curl -I https://nyala.my.to

# يجب أن تحصل على:
# HTTP/2 200
```

### 3. التحقق من أن العلامة الوصفية موجودة

بعد النشر، افتح الموقع وافحص الكود المصدري:
1. افتح `https://nyala.my.to`
2. اضغط `Ctrl+U` (أو `Cmd+Option+U` على Mac) لعرض الكود المصدري
3. ابحث عن: `google-site-verification`
4. يجب أن تجد: `<meta name="google-site-verification" content="cNMZJADogwcUzMspTwPKwZzWMwUOmc9N9fvzGxRO_Y8" />`

### 4. استخدام طريقة DNS بدلاً من HTML

إذا استمرت المشكلة، استخدم طريقة DNS TXT record:

**في إعدادات DNS لـ `nyala.my.to`:**
- **النوع:** TXT
- **الاسم:** `@` (أو اتركه فارغاً)
- **القيمة:** `google-site-verification=qbwa-1oRK5ELyxWHqt_6V1NbN1WTGdgw_jCeS45cPTQ`
- **TTL:** 3600

### 5. التحقق من robots.txt

تأكد من أن `robots.txt` لا يمنع Google:
```
User-agent: *
Allow: /
```

### 6. الانتظار

بعد إضافة العلامة الوصفية:
- انتظر 5-10 دقائق
- ثم حاول التحقق مرة أخرى في Google Search Console

## خطوات التحقق

1. ✅ تأكد من نشر التغييرات على VPS
2. ✅ تأكد من أن الموقع يعمل على `https://nyala.my.to`
3. ✅ افتح الكود المصدري وتحقق من وجود العلامة الوصفية
4. ✅ في Google Search Console، تأكد من استخدام `https://nyala.my.to` (مع https)
5. ✅ انتظر قليلاً ثم حاول التحقق مرة أخرى

## إذا استمرت المشكلة

استخدم طريقة **DNS TXT record** بدلاً من HTML meta tag - هذه الطريقة أكثر موثوقية.

