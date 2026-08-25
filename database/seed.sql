-- PathFinder AI - Comprehensive Seed Data
USE `pathfinder_ai`;

-- 1. Demo & Admin Users
-- Demo User Password: Demo@123 (bcrypt hash)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar`) VALUES
(1, 'Demo Learner', 'demo@pathfinder.ai', '$2b$10$EpRnTzWlqHNP0.fKbX26D.gN3F4yE1u4A2y1W3cZ4e5f6g7h8i9j0', 'learner', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'),
(2, 'Admin User', 'admin@pathfinder.ai', '$2b$10$EpRnTzWlqHNP0.fKbX26D.gN3F4yE1u4A2y1W3cZ4e5f6g7h8i9j0', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- 2. Learner Profile for Demo User
INSERT INTO `learner_profiles` (`user_id`, `experience_level`, `career_goal`, `interests`, `preferred_learning_style`, `weekly_learning_hours`, `target_completion_date`, `preferred_language`, `current_occupation`, `education_level`) VALUES
(1, 'intermediate', 'Full Stack Web Developer specializing in React and Node.js', 'Frontend Development, API Design, System Architecture, UI/UX', 'hands_on', 12, '2026-12-31', 'English', 'Junior Software Trainee', 'Bachelor of Computer Science')
ON DUPLICATE KEY UPDATE `career_goal`=VALUES(`career_goal`);

-- 3. Skills (20+ Skills)
INSERT INTO `skills` (`id`, `name`, `description`, `category`, `difficulty_level`) VALUES
(1, 'HTML5', 'Markup language for structuring web pages', 'Frontend', 'beginner'),
(2, 'CSS3', 'Styling language for web design and responsive layouts', 'Frontend', 'beginner'),
(3, 'JavaScript', 'Core programming language of the modern web', 'Programming', 'beginner'),
(4, 'Git & GitHub', 'Version control system and collaborative code hosting', 'Tools', 'beginner'),
(5, 'React.js', 'Declarative UI component library built by Meta', 'Frontend', 'intermediate'),
(6, 'Node.js', 'Asynchronous event-driven JavaScript runtime environment', 'Backend', 'intermediate'),
(7, 'Express.js', 'Fast, unopinionated web framework for Node.js', 'Backend', 'intermediate'),
(8, 'MySQL', 'Relational database management system', 'Database', 'intermediate'),
(9, 'RESTful APIs', 'Architectural style for building web services and HTTP APIs', 'Backend', 'intermediate'),
(10, 'TypeScript', 'Typed superset of JavaScript that compiles to plain JS', 'Programming', 'intermediate'),
(11, 'Tailwind CSS', 'Utility-first CSS framework for rapid UI development', 'Frontend', 'beginner'),
(12, 'Redux / Zustand', 'State management solutions for complex React apps', 'Frontend', 'intermediate'),
(13, 'Docker', 'Containerization platform for packaging applications', 'DevOps', 'advanced'),
(14, 'Next.js', 'React framework for production with SSR & static generation', 'Fullstack', 'advanced'),
(15, 'GraphQL', 'Query language and server runtime for client-driven APIs', 'Backend', 'advanced'),
(16, 'Web Security & JWT', 'Authentication, authorization, OWASP security best practices', 'Security', 'intermediate'),
(17, 'Unit & Integration Testing', 'Jest, Cypress, and automated code testing practices', 'Testing', 'intermediate'),
(18, 'MongoDB', 'NoSQL document database for JSON-like documents', 'Database', 'intermediate'),
(19, 'CI/CD Pipelines', 'Automated build, test, and deployment workflows', 'DevOps', 'advanced'),
(20, 'System Design', 'Designing scalable, resilient software architectures', 'Architecture', 'advanced')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 4. Skill Prerequisites Graph
INSERT INTO `skill_prerequisites` (`skill_id`, `prerequisite_skill_id`, `relationship_strength`) VALUES
(3, 1, 0.9), -- JavaScript requires HTML
(3, 2, 0.8), -- JavaScript requires CSS
(5, 3, 1.0), -- React requires JavaScript
(6, 3, 1.0), -- Node.js requires JavaScript
(7, 6, 1.0), -- Express requires Node.js
(8, 3, 0.5), -- MySQL benefits from JS logic
(9, 7, 0.9), -- REST APIs require Express
(9, 8, 0.7), -- REST APIs benefit from MySQL
(10, 3, 1.0),-- TypeScript requires JavaScript
(11, 2, 0.9),-- Tailwind requires CSS
(12, 5, 0.9),-- Redux requires React
(14, 5, 1.0),-- Next.js requires React
(15, 9, 0.8),-- GraphQL requires REST/API knowledge
(16, 9, 0.9),-- Web Security requires REST APIs
(17, 3, 0.7),-- Testing requires JS
(18, 6, 0.6),-- MongoDB benefits from Node.js
(19, 4, 0.8),-- CI/CD requires Git
(20, 9, 0.9) -- System design requires APIs & DB
ON DUPLICATE KEY UPDATE `relationship_strength`=VALUES(`relationship_strength`);

-- 5. User Initial Skills (Demo User)
INSERT INTO `user_skills` (`user_id`, `skill_id`, `proficiency_score`, `source`) VALUES
(1, 1, 90, 'self_assessment'),  -- HTML5 (Mastered)
(1, 2, 85, 'self_assessment'),  -- CSS3 (Mastered)
(1, 3, 82, 'assessment_result'),-- JavaScript (Mastered)
(1, 4, 90, 'self_assessment'),  -- Git & GitHub (Mastered)
(1, 5, 45, 'ai_profiler')       -- React.js (Partial)
ON DUPLICATE KEY UPDATE `proficiency_score`=VALUES(`proficiency_score`);

-- 6. Courses (30 Courses)
INSERT INTO `courses` (`id`, `title`, `description`, `provider`, `category`, `difficulty_level`, `duration_hours`, `url`, `thumbnail`, `rating`) VALUES
(1, 'HTML5 & CSS3 Essentials', 'Master modern web structure, semantic tags, Flexbox, and CSS Grid.', 'PathFinder Academy', 'Frontend', 'beginner', 6.0, 'https://developer.mozilla.org', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500', 4.8),
(2, 'Modern JavaScript Fundamentals', 'Deep dive into ES6+, async/await, closures, DOM manipulation, and promises.', 'PathFinder Academy', 'Programming', 'beginner', 12.0, 'https://javascript.info', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500', 4.9),
(3, 'Git & GitHub Workflow Mastery', 'Learn branching, merging, pull requests, rebase, and open-source workflows.', 'PathFinder Academy', 'Tools', 'beginner', 4.0, 'https://github.com', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500', 4.7),
(4, 'React 18 Architecture & Hooks', 'Build modern interactive Web UIs using React functional components, useState, and useEffect.', 'PathFinder Academy', 'Frontend', 'intermediate', 15.0, 'https://react.dev', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500', 4.9),
(5, 'Mastering React State Management (Zustand & Redux)', 'Handle complex application state, middleware, async thunks, and persistent stores.', 'PathFinder Academy', 'Frontend', 'intermediate', 8.0, 'https://zustand-demo.pmnd.rs', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500', 4.6),
(6, 'Node.js Core & Event Loop', 'Understand asynchronous JavaScript on the server, V8 engine, buffers, and event loop.', 'PathFinder Academy', 'Backend', 'intermediate', 10.0, 'https://nodejs.org', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500', 4.8),
(7, 'Express.js Enterprise Framework', 'Build lightweight, fast HTTP servers, middleware pipelines, routing, and controller patterns.', 'PathFinder Academy', 'Backend', 'intermediate', 9.0, 'https://expressjs.com', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500', 4.7),
(8, 'MySQL Relational Database Engineering', 'Master SQL queries, joins, indexes, foreign keys, normalization, and ACID transactions.', 'PathFinder Academy', 'Database', 'intermediate', 11.0, 'https://dev.mysql.com', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500', 4.8),
(9, 'RESTful API Design & Best Practices', 'Design clean, secure RESTful JSON APIs with proper HTTP verbs, status codes, and error handling.', 'PathFinder Academy', 'Backend', 'intermediate', 7.0, 'https://restfulapi.net', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500', 4.9),
(10, 'Full Stack Web Architecture', 'Integrate React frontend with Node/Express REST backend and MySQL persistent database.', 'PathFinder Academy', 'Fullstack', 'intermediate', 20.0, 'https://pathfinder.ai', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500', 4.9),
(11, 'TypeScript for Full Stack Developers', 'Add strict type safety, interfaces, generics, and decorators to frontend and backend JS.', 'PathFinder Academy', 'Programming', 'intermediate', 10.0, 'https://www.typescriptlang.org', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500', 4.8),
(12, 'Tailwind CSS UI Design System', 'Construct sleek responsive dark mode interfaces with zero custom CSS friction.', 'PathFinder Academy', 'Frontend', 'beginner', 5.0, 'https://tailwindcss.com', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500', 4.8),
(13, 'Docker Containers for Developers', 'Containerize Node.js services, MySQL servers, and multi-container Docker Compose stacks.', 'PathFinder Academy', 'DevOps', 'advanced', 8.0, 'https://www.docker.com', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=500', 4.7),
(14, 'Next.js App Router & SSR', 'Server-side rendering, static site generation, server actions, and full stack React apps.', 'PathFinder Academy', 'Fullstack', 'advanced', 14.0, 'https://nextjs.org', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', 4.9),
(15, 'GraphQL APIs with Apollo Server', 'Build flexible client-defined APIs with schema definitions, resolvers, and queries.', 'PathFinder Academy', 'Backend', 'advanced', 9.0, 'https://graphql.org', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500', 4.6),
(16, 'Web Security, JWT & OAuth2', 'Secure Web applications against XSS, CSRF, SQL Injection, and configure JWT tokens.', 'PathFinder Academy', 'Security', 'intermediate', 6.0, 'https://owasp.org', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500', 4.9),
(17, 'Automated Testing with Jest & Cypress', 'Unit test backend services and end-to-end test React component workflows.', 'PathFinder Academy', 'Testing', 'intermediate', 8.0, 'https://jestjs.io', 'https://images.unsplash.com/photo-1516116211223-48a406368d83?w=500', 4.7),
(18, 'MongoDB & Mongoose ODM', 'NoSQL document modeling, indexing, aggregation frameworks, and schema design.', 'PathFinder Academy', 'Database', 'intermediate', 10.0, 'https://www.mongodb.com', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500', 4.6),
(19, 'CI/CD with GitHub Actions', 'Automate linting, testing, Docker image creation, and automated server deployment.', 'PathFinder Academy', 'DevOps', 'advanced', 7.0, 'https://github.com/features/actions', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500', 4.8),
(20, 'High-Scale System Architecture', 'Microservices, caching with Redis, load balancing, message queues, and DB sharding.', 'PathFinder Academy', 'Architecture', 'advanced', 18.0, 'https://pathfinder.ai', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', 4.9),
(21, 'Responsive Web Layouts Masterclass', 'Master CSS Flexbox, Grid, container queries, and mobile-first design.', 'PathFinder Academy', 'Frontend', 'beginner', 4.5, 'https://developer.mozilla.org', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500', 4.7),
(22, 'Asynchronous JS & Async/Await', 'Master Promises, Event Loop, Microtasks, fetch API, and async programming.', 'PathFinder Academy', 'Programming', 'beginner', 5.0, 'https://javascript.info', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500', 4.8),
(23, 'React Router v6 Deep Dive', 'Nested routes, loaders, actions, dynamic routing, and protected auth guards.', 'PathFinder Academy', 'Frontend', 'intermediate', 4.0, 'https://reactrouter.com', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500', 4.6),
(24, 'Framer Motion & Modern Web Animation', 'Animate React components, page transitions, layout morphing, and gesture controls.', 'PathFinder Academy', 'Frontend', 'intermediate', 6.0, 'https://framer.com/motion', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500', 4.9),
(25, 'Node.js Security Best Practices', 'Helmet, rate limiting, data sanitization, CORS configuration, and security headers.', 'PathFinder Academy', 'Backend', 'intermediate', 5.0, 'https://nodejs.org', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500', 4.8),
(26, 'Advanced SQL Query Optimization', 'EXPLAIN plans, indexes, subqueries, CTEs, window functions, and query tuning.', 'PathFinder Academy', 'Database', 'advanced', 8.0, 'https://dev.mysql.com', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500', 4.7),
(27, 'Building Production REST APIs in Express', 'Modular controllers, error handling middleware, express-validator, and logging.', 'PathFinder Academy', 'Backend', 'intermediate', 7.5, 'https://expressjs.com', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500', 4.9),
(28, 'Data Visualization with Recharts', 'Integrate interactive line charts, bar graphs, radar maps, and pie charts in React.', 'PathFinder Academy', 'Frontend', 'intermediate', 4.0, 'https://recharts.org', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', 4.8),
(29, 'Full Stack Authentication System (JWT)', 'Build end-to-end auth with HTTP-only cookies, JWT refresh tokens, and password hashing.', 'PathFinder Academy', 'Fullstack', 'intermediate', 6.0, 'https://jwt.io', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500', 4.9),
(30, 'Production Deployment & Linux Setup', 'Deploy Node + MySQL apps to Linux VPS, Nginx reverse proxy, PM2, and SSL certificates.', 'PathFinder Academy', 'DevOps', 'advanced', 9.0, 'https://ubuntu.com', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=500', 4.9)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 7. Course Skills Mapping
INSERT INTO `course_skills` (`course_id`, `skill_id`, `importance`) VALUES
(1, 1, 'primary'), (1, 2, 'primary'),
(2, 3, 'primary'),
(3, 4, 'primary'),
(4, 5, 'primary'), (4, 3, 'prerequisite'),
(5, 12, 'primary'), (5, 5, 'prerequisite'),
(6, 6, 'primary'), (6, 3, 'prerequisite'),
(7, 7, 'primary'), (7, 6, 'prerequisite'),
(8, 8, 'primary'),
(9, 9, 'primary'), (9, 7, 'prerequisite'), (9, 8, 'secondary'),
(10, 5, 'primary'), (10, 6, 'primary'), (10, 7, 'primary'), (10, 8, 'primary'), (10, 9, 'primary'),
(11, 10, 'primary'), (11, 3, 'prerequisite'),
(12, 11, 'primary'), (12, 2, 'prerequisite'),
(13, 13, 'primary'), (13, 6, 'secondary'),
(14, 14, 'primary'), (14, 5, 'prerequisite'),
(15, 15, 'primary'), (15, 9, 'prerequisite'),
(16, 16, 'primary'), (16, 9, 'prerequisite'),
(17, 17, 'primary'), (17, 3, 'prerequisite'),
(18, 18, 'primary'),
(19, 19, 'primary'), (19, 4, 'prerequisite'),
(20, 20, 'primary'), (20, 9, 'prerequisite'),
(23, 5, 'primary'), (25, 16, 'primary'), (27, 9, 'primary'), (29, 16, 'primary')
ON DUPLICATE KEY UPDATE `importance`=VALUES(`importance`);

-- 8. Projects (15 Projects)
INSERT INTO `projects` (`id`, `title`, `description`, `difficulty_level`, `estimated_hours`, `url`) VALUES
(1, 'Personal Portfolio Web App', 'Build a responsive personal website with HTML5, CSS3, and modern Flexbox layouts.', 'beginner', 8.0, 'https://github.com/topics/portfolio'),
(2, 'Interactive Dynamic Dashboard', 'Build an interactive JavaScript web page featuring local storage, DOM updates, and dark mode.', 'beginner', 12.0, 'https://github.com/topics/dashboard'),
(3, 'E-Commerce Frontend with React & Tailwind', 'Build a product catalog, shopping cart, filter controls, and responsive UI using React and Tailwind CSS.', 'intermediate', 20.0, 'https://github.com/topics/react-ecommerce'),
(4, 'RESTful Notes & Task API with Node & Express', 'Build a CRUD backend service with Node.js, Express, input validation, and route parameters.', 'intermediate', 15.0, 'https://github.com/topics/express-api'),
(5, 'Relational Database Schema for E-Learning', 'Design normalized tables, write complex JOIN queries, and benchmark MySQL indexes.', 'intermediate', 10.0, 'https://github.com/topics/mysql'),
(6, 'Full Stack PathFinder AI Platform', 'Build an end-to-end web app with React UI, Express REST API, JWT auth, MySQL persistence, and AI assistant.', 'advanced', 35.0, 'https://github.com/topics/fullstack'),
(7, 'Real-time Chat App with Socket.io', 'Build real-time multi-room messaging with WebSockets, Express backend, and React UI.', 'advanced', 25.0, 'https://github.com/topics/socket-io'),
(8, 'JWT Auth Microservice with Rate Limiting', 'Build a secure authentication service with bcrypt, access/refresh tokens, and Redis rate limiting.', 'intermediate', 14.0, 'https://github.com/topics/jwt-authentication'),
(9, 'DevOps Dockerized Web Stack', 'Package React frontend, Node backend, and MySQL database into Docker Compose network.', 'advanced', 18.0, 'https://github.com/topics/docker-compose'),
(10, 'Automated API Test Suite', 'Write unit and end-to-end tests for express routes using Jest and Supertest.', 'intermediate', 12.0, 'https://github.com/topics/jest'),
(11, 'Next.js Modern SaaS Landing Page', 'Build a high-performance landing page with SSR, Tailwind CSS, and Framer Motion animations.', 'intermediate', 16.0, 'https://github.com/topics/nextjs'),
(12, 'Blog Engine with Markdown Support', 'Full stack blog platform featuring markdown parsing, post categorizing, and comment threads.', 'intermediate', 18.0, 'https://github.com/topics/blog-engine'),
(13, 'Weather Analytics App with Chart.js', 'Fetch real-time open weather data and plot multi-day weather trends.', 'beginner', 10.0, 'https://github.com/topics/chartjs'),
(14, 'System Health & Metrics Monitor', 'Server monitoring dashboard displaying memory usage, CPU load, and DB query metrics.', 'advanced', 22.0, 'https://github.com/topics/metrics'),
(15, 'GraphQL API Gateway', 'Build a aggregated GraphQL schema wrapping legacy REST endpoints.', 'advanced', 20.0, 'https://github.com/topics/graphql')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 9. Project Skills Mapping
INSERT INTO `project_skills` (`project_id`, `skill_id`) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 11),
(4, 6), (4, 7), (4, 9),
(5, 8),
(6, 5), (6, 6), (6, 7), (6, 8), (6, 9), (6, 16),
(7, 5), (7, 6), (7, 9),
(8, 7), (8, 9), (8, 16),
(9, 13), (9, 6), (9, 8),
(10, 17), (10, 7),
(11, 14), (11, 11),
(12, 5), (12, 7), (12, 8)
ON DUPLICATE KEY UPDATE `skill_id`=VALUES(`skill_id`);

-- 10. Assessments (10 Assessments)
INSERT INTO `assessments` (`id`, `title`, `description`, `difficulty_level`, `duration_minutes`) VALUES
(1, 'HTML5 & Semantic Markup Assessment', 'Test your knowledge of semantic HTML tags, accessibility attributes, and DOM structure.', 'beginner', 20),
(2, 'CSS Flexbox & Responsive Layout Test', 'Assess skills in CSS Grid, Flexbox, media queries, and responsive design concepts.', 'beginner', 25),
(3, 'JavaScript Core Engine & ES6 Test', 'Evaluate closures, event loops, promises, scope, and array operations.', 'intermediate', 30),
(4, 'React Hooks & Component Lifecycle Quiz', 'Test understanding of React hooks, component rendering, keys, and state updates.', 'intermediate', 30),
(5, 'Node.js & Asynchronous Architecture Exam', 'Evaluate asynchronous I/O, event emitters, file systems, and module resolution.', 'intermediate', 35),
(6, 'Express.js & Middleware Security Test', 'Test router design, custom middleware, error handling, and security headers.', 'intermediate', 25),
(7, 'MySQL Queries & Relational Design Exam', 'Evaluate SQL joins, subqueries, table indexing, and database normalization.', 'intermediate', 35),
(8, 'RESTful API Architecture Assessment', 'Assess HTTP methods, status codes, payload structures, and API authentication.', 'intermediate', 30),
(9, 'Full Stack Development Readiness Evaluation', 'Comprehensive benchmark test covering React, Node.js, Express, MySQL, and Security.', 'advanced', 45),
(10, 'Web Security & OWASP Top 10 Quiz', 'Evaluate vulnerabilities prevention (SQLi, XSS, CSRF) and JWT token validation.', 'intermediate', 25)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 11. Assessment Skills Mapping
INSERT INTO `assessment_skills` (`assessment_id`, `skill_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 9),
(9, 5), (9, 6), (9, 7), (9, 8), (9, 9),
(10, 16)
ON DUPLICATE KEY UPDATE `skill_id`=VALUES(`skill_id`);

-- 12. Demo Initial Learning Path
INSERT INTO `learning_paths` (`id`, `user_id`, `title`, `goal`, `description`, `status`, `overall_progress`) VALUES
(1, 1, 'Full Stack Developer Roadmap (React + Node.js)', 'Full Stack Web Developer specializing in React and Node.js', 'Personalized adaptive roadmap generated by PathFinder AI based on your mastered skills (HTML, CSS, JS, Git) and missing goals.', 'active', 25)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 13. Demo Learning Path Steps
INSERT INTO `learning_path_steps` (`learning_path_id`, `step_order`, `title`, `resource_type`, `resource_id`, `skill_id`, `milestone`, `estimated_hours`, `status`, `completion_percentage`) VALUES
(1, 1, 'HTML5 & CSS3 Essentials', 'course', 1, 1, 'Web Foundations Mastered', 6.0, 'completed', 100),
(2, 2, 'Modern JavaScript Fundamentals', 'course', 2, 3, 'Web Foundations Mastered', 12.0, 'completed', 100),
(3, 3, 'Git & GitHub Workflow Mastery', 'course', 3, 4, 'Version Control Mastery', 4.0, 'completed', 100),
(4, 4, 'React 18 Architecture & Hooks', 'course', 4, 5, 'Frontend Mastery', 15.0, 'in_progress', 45),
(5, 5, 'Node.js Core & Event Loop', 'course', 6, 6, 'Backend Runtime Mastery', 10.0, 'available', 0),
(6, 6, 'Express.js Enterprise Framework', 'course', 7, 7, 'Server Framework Mastery', 9.0, 'locked', 0),
(7, 7, 'MySQL Relational Database Engineering', 'course', 8, 8, 'Data Persistence Mastery', 11.0, 'locked', 0),
(8, 8, 'RESTful API Design & Best Practices', 'course', 9, 9, 'API Engineering Mastery', 7.0, 'locked', 0),
(9, 9, 'Full Stack PathFinder AI Platform', 'project', 6, 5, 'Full Stack Capstone', 35.0, 'locked', 0),
(10, 10, 'Full Stack Development Readiness Evaluation', 'assessment', 9, 9, 'Final Certification', 0.75, 'locked', 0)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 14. Demo Recommendations
INSERT INTO `recommendations` (`user_id`, `resource_type`, `resource_id`, `recommendation_score`, `reason`, `priority`, `status`) VALUES
(1, 'course', 4, 98.5, 'React.js is the next primary prerequisite for your Full Stack Developer goal. You already mastered JavaScript (82%)!', 'high', 'accepted'),
(1, 'course', 6, 92.0, 'Node.js runtime is essential before moving into Express server framework.', 'high', 'pending'),
(1, 'course', 8, 88.0, 'MySQL database engineering will complete your backend data persistence requirement.', 'medium', 'pending'),
(1, 'project', 3, 85.0, 'Building an E-Commerce React UI will solidify component state management.', 'medium', 'pending'),
(1, 'assessment', 4, 80.0, 'Validate your React component knowledge with an interactive 30-minute test.', 'low', 'pending')
ON DUPLICATE KEY UPDATE `recommendation_score`=VALUES(`recommendation_score`);
