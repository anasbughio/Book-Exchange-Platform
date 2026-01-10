 

Web Hackathon
Team members
Anas (F2022266023)
Awais Chaudhry (F2022266045)
Ali Masood (F2022266014)


📚 BooksExchange – A Community-Driven Book Swapping Platform
Overview
BooksExchange is a digital platform designed for book lovers to swap books using a points-based system. Each physical book carries a unique digital identity, preserving its reading journey and connecting readers beyond the exchange.
The platform encourages community engagement through discussions, wishlists, and forums, creating a vibrant ecosystem for readers.
________________________________________
Objective
The goal of BooksExchange is to:
•	Enable fair book swapping using points.
•	Maintain a QR-based history for each physical book.
•	Connect readers to relevant forums and discussions.
________________________________________
Tech Stack
Layer	Technology Used
Backend	Supabase
Frontend	React, JavaScript
Database	Supabase
Hosting	Vercel
AI Integration	Condition, demand, and rarity analysis for point system
________________________________________
Core Features
✅ Fully Implemented Features
1.	User Management
o	User signup and login with secure authentication.
o	Profile management and account handling.
2.	Book Listing & Discovery
o	Users can list books with title, author, condition, pictures, and location.
o	Browse and search for books with filters.
o	Add books to wishlists with availability alerts.
3.	Point-Based Exchange System
o	Users earn points by listing and giving books.
o	Users redeem points to request books.
o	AI integration predicts book value based on:
	Condition
	Demand
	Rarity
o	Fair exchange logic implemented to prevent circular farming.
________________________________________
⚠️ Partially Implemented Features
1.	Payment Gateway
o	Users cannot yet purchase points via Stripe.
2.	Exchange Point Map
o	Physical exchange points partially visible on maps; contact integration incomplete.
3.	QR Code-Based Book History
o	QR codes are generated and scannable; reading history is not fully implemented yet.
4.	Book Forums
o	Users can view discussions; full moderation and chapter-wise features are partial.
5.	In-App Messaging
o	Chat system partially integrated; not fully functional yet.
________________________________________
Screenshots / UI Previews
Replace these placeholders with actual screenshots from your app.
•	Login / Signup Page
 
•	Book Listing / Browse Page
 
•	User Profile / Add Book
 
•	Points Dashboard
 
•	Exchange Point Map (Partial)
 
________________________________________
System Architecture
High-Level Flow
1.	Frontend (React)
o	Handles UI rendering, user interactions, and API calls.
o	Communicates with Supabase for authentication, database queries, and real-time updates.
2.	Backend & Database (Supabase)
o	Manages users, books, points, forums, and QR code data.
o	Implements AI integration for fair point calculation.
o	Provides APIs for book listing, searching, and forum posts.
3.	Hosting (Vercel)
o	Serves frontend application with scalable deployment.
________________________________________
Database Design (Supabase)
Table Name	Columns / Description
Users	id, username, email, password_hash, points
Books	id, title, author, condition, images, owner_id, qr_code
BookHistory	id, book_id, user_id, notes, city, read_duration
Transactions	id, sender_id, receiver_id, points, date
Forums	id, book_id, user_id, title, content, anonymous
Messages	id, sender_id, receiver_id, content, timestamp
ExchangePoints	id, name, location, contact
________________________________________
Setup & Installation
Frontend
git clone <your-repo-url>
cd frontend
npm install
npm run dev
Backend / Supabase
1.	Create a Supabase project.
2.	Configure database tables (use SQL provided in repo).
3.	Update .env file with Supabase credentials.
Deployment
•	Frontend hosted on Vercel.
•	Backend connected to Supabase.
•	Deployed Link: Placeholder Link
________________________________________
Future Enhancements
•	Complete payment integration via Stripe for point purchase.
•	Full QR code book history tracking.
•	Advanced forum moderation and chapter-wise discussions.
•	Full in-app messaging with notifications.
•	Mobile app version with push notifications.
•	Containerize using Docker for easier deployment.
________________________________________
Challenges & Solutions
•	AI-based Point System: Creating a fair system to prevent point farming; solved using transaction validation and condition-based scoring.
•	Exchange Points Mapping: Handling real-time location updates; partial implementation done using map markers.
•	QR Code Integration: Generating unique QR codes for physical books; reading history is next step.
________________________________________
Credits / References
•	Frontend: React Documentation
•	Backend: Supabase Documentation
•	Hosting: Vercel Documentation
•	AI/Point System Logic: Custom algorithm based on book condition, rarity, and demand
________________________________________
Project Status
Feature	Status
User Authentication	✅ Complete
Book Listing & Browsing	✅ Complete
Point-Based Exchange System	✅ Complete
Payment Gateway	⚠️ Partial
Exchange Points Map	⚠️ Partial
QR-Based Book History	⚠️ Partial
Book Forums	⚠️ Partial
In-App Messaging	⚠️ Partial
________________________________________
