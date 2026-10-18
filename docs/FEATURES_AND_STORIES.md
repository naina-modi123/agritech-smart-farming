# Feature coverage: Skill Wallet AgriTech capstone

## Epic 1 — Environment and authentication
1. Configure React/Vite client and Express API.
2. Connect MongoDB through environment variables.
3. Register and log in with validated credentials.
4. Hash passwords with bcrypt and issue JWTs.
5. Protect authenticated routes and separate farmer/admin access.

## Epic 2 — Farm and crop management
6. Create, list, update and delete farm profiles.
7. Store farm location, area, soil type and optional coordinates.
8. Create, list, update and delete crop records.
9. Track planting date, crop variety, stage and notes.

## Epic 3 — Weather, soil and crop protection
10. Fetch current weather and five-day forecast from Open-Meteo.
11. Store soil test readings and display rule-based guidance.
12. Generate crop inspection reminders based on saved crop stage.

## Epic 4 — Resource management
13. Browse a small resource catalog.
14. Place a demo order and calculate total from server-side catalog prices.
15. Track order history and allow admin to update order status.

## Epic 5 — Expert consultation and community
16. Submit and track consultation requests.
17. Publish community posts with admin moderation.

## Epic 6 — Administration, validation and usability
18. Display platform summary and user list for admins.
19. Provide responsive layout, English/Hindi navigation labels, API validation, security middleware and a Postman collection.

## Known limitations
- Soil guidance is illustrative, not a substitute for a lab report.
- Pest alerts are inspection reminders, not live outbreak data or diagnosis.
- Resource checkout is a demo with no payment gateway.
- No chat/realtime notification service is included.
