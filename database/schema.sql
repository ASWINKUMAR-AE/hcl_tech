-- PathFinder AI - Database Schema Definition
-- Works with MySQL / MariaDB via XAMPP

CREATE DATABASE IF NOT EXISTS `pathfinder_ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pathfinder_ai`;

-- 1. Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('learner', 'admin') DEFAULT 'learner',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Learner Profiles table
CREATE TABLE IF NOT EXISTS `learner_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `experience_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `career_goal` VARCHAR(255) NOT NULL,
  `interests` TEXT DEFAULT NULL,
  `preferred_learning_style` ENUM('visual', 'hands_on', 'reading', 'video', 'project_based') DEFAULT 'hands_on',
  `weekly_learning_hours` INT DEFAULT 10,
  `target_completion_date` DATE DEFAULT NULL,
  `preferred_language` VARCHAR(50) DEFAULT 'English',
  `current_occupation` VARCHAR(100) DEFAULT NULL,
  `education_level` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Skills table
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_skills_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Skills table
CREATE TABLE IF NOT EXISTS `user_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  `proficiency_score` INT DEFAULT 0, -- 0-100 scale
  `source` ENUM('self_assessment', 'assessment_result', 'course_completion', 'ai_profiler') DEFAULT 'ai_profiler',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_skill` (`user_id`, `skill_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Courses table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `provider` VARCHAR(100) DEFAULT 'PathFinder Academy',
  `category` VARCHAR(100) NOT NULL,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `duration_hours` DECIMAL(5,2) DEFAULT 5.0,
  `url` VARCHAR(255) DEFAULT '#',
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.5,
  `language` VARCHAR(50) DEFAULT 'English',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_courses_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Course Skills table
CREATE TABLE IF NOT EXISTS `course_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  `importance` ENUM('primary', 'secondary', 'prerequisite') DEFAULT 'primary',
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Projects table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
  `estimated_hours` DECIMAL(5,2) DEFAULT 10.0,
  `url` VARCHAR(255) DEFAULT '#',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Project Skills table
CREATE TABLE IF NOT EXISTS `project_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Assessments table
CREATE TABLE IF NOT EXISTS `assessments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `duration_minutes` INT DEFAULT 30,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Assessment Skills table
CREATE TABLE IF NOT EXISTS `assessment_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessment_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Skill Prerequisites table (Skill Graph)
CREATE TABLE IF NOT EXISTS `skill_prerequisites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `skill_id` INT NOT NULL,
  `prerequisite_skill_id` INT NOT NULL,
  `relationship_strength` DECIMAL(3,2) DEFAULT 1.0, -- 0.1 to 1.0
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`prerequisite_skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_skill_prereq` (`skill_id`, `prerequisite_skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Learning History table
CREATE TABLE IF NOT EXISTS `learning_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `resource_type` ENUM('course', 'project', 'assessment') NOT NULL,
  `resource_id` INT NOT NULL,
  `status` ENUM('not_started', 'in_progress', 'completed', 'skipped') DEFAULT 'not_started',
  `progress_percentage` INT DEFAULT 0,
  `score` INT DEFAULT NULL,
  `started_at` TIMESTAMP NULL DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Learning Paths table
CREATE TABLE IF NOT EXISTS `learning_paths` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `goal` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('active', 'completed', 'archived') DEFAULT 'active',
  `overall_progress` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Learning Path Steps table
CREATE TABLE IF NOT EXISTS `learning_path_steps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `learning_path_id` INT NOT NULL,
  `step_order` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `resource_type` ENUM('course', 'project', 'assessment') NOT NULL,
  `resource_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  `milestone` VARCHAR(150) NOT NULL,
  `estimated_hours` DECIMAL(5,2) DEFAULT 5.0,
  `status` ENUM('locked', 'available', 'in_progress', 'completed', 'skipped') DEFAULT 'locked',
  `completion_percentage` INT DEFAULT 0,
  FOREIGN KEY (`learning_path_id`) REFERENCES `learning_paths`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Recommendations table
CREATE TABLE IF NOT EXISTS `recommendations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `resource_type` ENUM('course', 'project', 'assessment') NOT NULL,
  `resource_id` INT NOT NULL,
  `recommendation_score` DECIMAL(5,2) DEFAULT 0.0, -- 0 to 100
  `reason` TEXT DEFAULT NULL,
  `priority` ENUM('high', 'medium', 'low') DEFAULT 'medium',
  `status` ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. User Feedback table
CREATE TABLE IF NOT EXISTS `user_feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `recommendation_id` INT DEFAULT NULL,
  `feedback_type` ENUM('useful', 'not_useful', 'too_easy', 'too_hard', 'completed', 'skipped') NOT NULL,
  `feedback_text` TEXT DEFAULT NULL,
  `rating` INT DEFAULT NULL, -- 1-5 scale
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. AI Conversations table
CREATE TABLE IF NOT EXISTS `ai_conversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `session_id` VARCHAR(100) NOT NULL,
  `role` ENUM('user', 'assistant') NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_ai_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. User Embeddings table (Vector Search Layer Abstraction)
CREATE TABLE IF NOT EXISTS `user_embeddings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `content_type` ENUM('goal', 'skill_profile', 'course', 'project') NOT NULL,
  `content_id` INT DEFAULT NULL,
  `embedding_reference` TEXT DEFAULT NULL, -- Vector JSON array representation
  `embedding_model` VARCHAR(100) DEFAULT 'multilingual-e5-base-mock',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
