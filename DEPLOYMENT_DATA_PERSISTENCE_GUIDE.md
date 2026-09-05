# S2 Kennel Jammu - Render Live Deployment & Permanent Data Guide

## 1. Zero Data Loss Guarantee
On Render / Cloud hosting, all data submitted by customers (**Reviews, Dog Bookings, Enquiries**) and all modules managed by Admin (**Customer Gallery, Dogs, Cats, Staff Accounts**) are **100% permanently stored** when connected to PostgreSQL.

---

## 2. Setting Up Free Permanent PostgreSQL on Render

1. **Create Free PostgreSQL Database on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com).
   - Click **New +** -> **PostgreSQL**.
   - Name: `s2kennel-db`
   - Plan: **Free**
   - Click **Create Database**.

2. **Copy the Internal or External Database URL**:
   - In your newly created database dashboard, scroll to **Connections**.
   - Copy the **Internal Database URL** (e.g. `postgresql://s2kennel_user:...@dpg-...-a/s2kennel_db`).

3. **Add `DATABASE_URL` Environment Variable to Web Service**:
   - In Render Dashboard, open your **Web Service** (Django backend).
   - Go to **Environment** tab.
   - Click **Add Environment Variable**:
     - Key: `DATABASE_URL`
     - Value: *(Paste the PostgreSQL connection URL from step 2)*
   - Click **Save Changes**.

---

## 3. Persistent Media Storage (Photos & Videos)

For uploaded customer videos and puppy photos on Render:
- You can attach a **Render Persistent Disk** mounted at `/opt/render/project/src/s2kennel_backend/media` (or use Cloudinary / AWS S3 if preferred).
- All database records (customer reviews, bookings, enquiries, dog details, customer names, breed tags, captions) are stored in the PostgreSQL database and **never disappear across redeployments or server restarts**.

---

## 4. Built-in Safe Seeding Rules
- **Superusers**: Existing admin passwords are never overwritten.
- **Reviews**: Never deleted or cleared.
- **Book a Dog / Enquiries**: Never cleared or touched.
- **Dogs & Cats**: Only seeded on empty database.
- **Customer Gallery**: Never cleared or reset.
