# Render Environment Checklist

Bu dosya, backend servisi Render'a deploy edilirken ortam degiskenlerini dogru ayarlamak icin hizli kontrol listesidir.

## Backend Service (Render)

- `NODE_ENV=production`
- `PORT=10000` (Render runtime portu)
- `MONGO_URI=<atlas-uri>/ecommerce_architect?...`
- `JWT_SECRET=<guclu-rastgele-gizli-anahtar>`
- `JWT_EXPIRES_IN=7d`
- `FRONTEND_URL=https://eticaret-vitrin.onrender.com`
- `SEED_ON_STARTUP=false`
- `STRIPE_SECRET_KEY=<stripe-secret>` (kart odemesi kullaniliyorsa)

## Optional Admin Seed Inputs

- `ADMIN_NAME=Admin`
- `ADMIN_EMAIL=admin@earchitect.com`
- `ADMIN_PASSWORD=<guclu-sifre>`

Not: `SEED_ON_STARTUP=false` iken admin seed otomatik calismaz. Gecici seed gerekiyorsa bir deploy boyunca `SEED_ON_STARTUP=true` yapip, sonraki deployda tekrar `false` yap.

## Frontend Service (Render)

- Vite build output deploy ediliyorsa backend URL'nin dogru oldugunu kontrol et.
- API hostu backend domaine bakmali: `https://eticaret-backend-tvpe.onrender.com/api`

## Post-Deploy Quick Checks

1. `GET /api/health` -> 200
2. Login -> token olusuyor mu
3. Siparis olusturma -> 201
4. Admin panelden durum guncelleme -> musteride yansiyor mu
5. Iade reddetme -> 200 ve sebep gorunur

## Local Note

Yerelde 5000 portu doluysa backend acilmaz (`EADDRINUSE`).
Ayni portu kullanan sureci kapat ya da gecici farkli `PORT` ile baslat.
