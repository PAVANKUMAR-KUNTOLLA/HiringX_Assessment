Project Setup:

Frontend Setup:
- Navigated to the 'frontend' directory.
- Installed dependencies using 'npm install'.
- Started the frontend server via 'npm run start'.

Backend Setup:
- Navigated to the 'backend' directory.
- Installed necessary packages with 'npm install'.
- Launched the backend server with 'npm run start'.

Technology Stack Utilized:
- Leveraged Node.js and npm.
- Employed Express.js for API development.
- Managed data with MongoDB.
- Utilized the jsonwebtoken library for JWT management.
- Constructed components and functionality with React.js.

Signup Screen Implementation:
- Incorporated fields for email, password (with confirmation), and optional details such as name and profile picture.
- Employed React's state management and validation libraries for field validation and email format verification.
- Included a checkbox for accepting terms and conditions.
- Provided clear error messages and success notifications.
- Simulated sending a welcome email upon successful signup.
- Implemented redirection to the post list screen using React Router after signup completion.

Post List Screen Development:
- Developed a scrolling post list screen that fetches data via a GET API.
- Ensured responsiveness and visual consistency with the "MelodyVerse" theme by utilizing Tailwind CSS.

API Endpoint Implementation:
- Developed a '/signup' endpoint to handle user registration, ensuring data uniqueness and secure password hashing. Returned a JWT token upon successful registration.
- Created a '/posts' endpoint for retrieving paginated post data from the database, with authentication checks.

JWT Implementation:
- Generated JWT tokens containing appropriate payload and expiration upon successful login.
- Implemented token validation in protected routes to authenticate users.

Best Practices Followed:
- Utilized bcrypt for secure password hashing.
- Implemented comprehensive error handling to provide clear feedback.
- Wrote well-structured and documented code throughout the project.
- Utilized environment variables to protect sensitive information.
- Ensured effective session management and token expiration handling.

Bonus Points Achieved:
- Successfully implemented password reset functionality.
- Integrated email verification for user signups.
- Added rate limiting to protect against brute force attacks.
- Utilized middleware for authentication and authorization purposes.
- Implemented social login options and password visibility toggle using mock APIs and React libraries.
