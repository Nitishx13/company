-- GMBQYN — MySQL 8.0+ schema
-- Reputation management SaaS for Google Business Profiles.
-- Mirrors the TypeScript contracts in `lib/gmbqyn/types.ts`.
--
-- Usage:
--   mysql -u root -p < schema.sql
--
-- All money columns are DECIMAL(10,2) in the smallest currency unit of the
-- plan's `currency` (INR paise-free rupees). Timestamps are stored in UTC.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `gmbqyn`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `gmbqyn`;

-- ---------------------------------------------------------------------------
-- Enumerations
-- ---------------------------------------------------------------------------

CREATE TABLE `roles` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `roles` (`name`) VALUES ('customer'), ('admin');

CREATE TABLE `user_statuses` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_statuses_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `user_statuses` (`name`) VALUES ('active'), ('invited'), ('suspended');

CREATE TABLE `business_statuses` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_statuses_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `business_statuses` (`name`) VALUES ('pending'), ('active'), ('suspended');

CREATE TABLE `billing_cycles` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `billing_cycles_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `billing_cycles` (`name`) VALUES ('monthly'), ('yearly');

CREATE TABLE `subscription_statuses` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subscription_statuses_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `subscription_statuses` (`name`)
VALUES ('trial'), ('active'), ('past_due'), ('expired'), ('cancelled');

CREATE TABLE `payment_methods` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_methods_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `payment_methods` (`name`)
VALUES ('cash'), ('upi'), ('bank_transfer'), ('card'), ('cheque');

CREATE TABLE `payment_statuses` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_statuses_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `payment_statuses` (`name`)
VALUES ('pending'), ('verified'), ('failed'), ('refunded');

CREATE TABLE `review_sources` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `review_sources_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `review_sources` (`name`) VALUES ('qr'), ('link'), ('manual'), ('import');

CREATE TABLE `review_statuses` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `review_statuses_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `review_statuses` (`name`)
VALUES ('pending'), ('approved'), ('rejected'), ('flagged');

CREATE TABLE `feedback_statuses` (
  `id`   TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20)     NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feedback_statuses_name_unique` (`name`)
) ENGINE=InnoDB;

INSERT INTO `feedback_statuses` (`name`)
VALUES ('new'), ('in_progress'), ('resolved'), ('spam');

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

CREATE TABLE `users` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`        TINYINT UNSIGNED NOT NULL,
  `status_id`      TINYINT UNSIGNED NOT NULL,
  `name`           VARCHAR(120)   NOT NULL,
  `email`          VARCHAR(191)   NOT NULL,
  `phone`          VARCHAR(32)    DEFAULT NULL,
  `password`       VARCHAR(255)   NOT NULL COMMENT 'bcrypt/argon2 hash',
  `avatar_url`     VARCHAR(512)   DEFAULT NULL,
  `email_verified_at` TIMESTAMP   DEFAULT NULL,
  `last_login_at`  TIMESTAMP      NULL DEFAULT NULL,
  `created_at`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_status_index` (`role_id`, `status_id`),
  CONSTRAINT `users_role_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_status_fk` FOREIGN KEY (`status_id`) REFERENCES `user_statuses` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `password_reset_tokens` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `token_hash` CHAR(64)       NOT NULL,
  `expires_at` TIMESTAMP      NOT NULL,
  `used_at`    TIMESTAMP      NULL DEFAULT NULL,
  `created_at` TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `password_reset_tokens_hash_unique` (`token_hash`),
  KEY `password_reset_tokens_user_index` (`user_id`),
  CONSTRAINT `password_reset_tokens_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `personal_access_tokens` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL,
  `name`          VARCHAR(120) NOT NULL DEFAULT 'gmbqyn-web',
  `token_hash`    CHAR(64)     NOT NULL COMMENT 'sha256 of the bearer token',
  `abilities`     VARCHAR(255) NOT NULL DEFAULT '["*"]',
  `last_used_at`  TIMESTAMP    NULL DEFAULT NULL,
  `expires_at`    TIMESTAMP    NULL DEFAULT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_hash_unique` (`token_hash`),
  KEY `personal_access_tokens_user_index` (`user_id`),
  CONSTRAINT `personal_access_tokens_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Businesses and review links
-- ---------------------------------------------------------------------------

CREATE TABLE `businesses` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`             BIGINT UNSIGNED NOT NULL,
  `status_id`           TINYINT UNSIGNED NOT NULL,
  `name`                VARCHAR(180)   NOT NULL,
  `slug`                VARCHAR(191)   NOT NULL COMMENT 'public review-link slug',
  `category`            VARCHAR(120)   NOT NULL,
  `description`         TEXT           DEFAULT NULL,
  `address`             VARCHAR(255)   DEFAULT NULL,
  `city`                VARCHAR(120)   DEFAULT NULL,
  `state`               VARCHAR(120)   DEFAULT NULL,
  `country`             VARCHAR(120)   NOT NULL DEFAULT 'India',
  `phone`               VARCHAR(32)    DEFAULT NULL,
  `website`             VARCHAR(255)   DEFAULT NULL,
  `logo_url`            VARCHAR(512)   DEFAULT NULL,
  `google_place_id`     VARCHAR(191)   DEFAULT NULL,
  `google_review_url`   VARCHAR(512)   DEFAULT NULL,
  `rating`              DECIMAL(2,1)   DEFAULT NULL,
  `review_count`        INT UNSIGNED  DEFAULT NULL,
  `review_link_enabled` TINYINT(1)     NOT NULL DEFAULT 1,
  `created_at`          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `businesses_slug_unique` (`slug`),
  KEY `businesses_user_index` (`user_id`),
  KEY `businesses_status_index` (`status_id`),
  KEY `businesses_name_index` (`name`),
  FULLTEXT KEY `businesses_search_index` (`name`, `category`, `city`),
  CONSTRAINT `businesses_user_fk`   FOREIGN KEY (`user_id`)   REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `businesses_status_fk` FOREIGN KEY (`status_id`) REFERENCES `business_statuses` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `review_links` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id`  BIGINT UNSIGNED NOT NULL,
  `slug`         VARCHAR(191)   NOT NULL,
  `is_active`    TINYINT(1)     NOT NULL DEFAULT 1,
  `clicks`       INT UNSIGNED  NOT NULL DEFAULT 0,
  `submissions`  INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `review_links_slug_unique` (`slug`),
  UNIQUE KEY `review_links_business_unique` (`business_id`),
  CONSTRAINT `review_links_business_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Plans and subscriptions
-- ---------------------------------------------------------------------------

CREATE TABLE `plans` (
  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code`                  VARCHAR(40)    NOT NULL,
  `name`                  VARCHAR(80)    NOT NULL,
  `tagline`               VARCHAR(191)   DEFAULT NULL,
  `price_monthly`         DECIMAL(10,2)  NOT NULL DEFAULT 0,
  `price_yearly`          DECIMAL(10,2)  NOT NULL DEFAULT 0,
  `currency`              CHAR(3)        NOT NULL DEFAULT 'INR',
  `review_link_enabled`   TINYINT(1)     NOT NULL DEFAULT 1,
  `qr_enabled`            TINYINT(1)     NOT NULL DEFAULT 0,
  `qr_custom_branding`    TINYINT(1)     NOT NULL DEFAULT 0,
  `feedback_enabled`      TINYINT(1)     NOT NULL DEFAULT 0,
  `analytics_enabled`     TINYINT(1)     NOT NULL DEFAULT 0,
  `google_sync`           TINYINT(1)     NOT NULL DEFAULT 0,
  `max_reviews_per_month` INT UNSIGNED  DEFAULT NULL COMMENT 'NULL = unlimited',
  `seats`                 INT UNSIGNED  NOT NULL DEFAULT 1,
  `sort_order`            INT            NOT NULL DEFAULT 0,
  `is_active`             TINYINT(1)     NOT NULL DEFAULT 1,
  `features`              JSON           DEFAULT NULL,
  `created_at`            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_code_unique` (`code`)
) ENGINE=InnoDB;

CREATE TABLE `subscriptions` (
  `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id`          BIGINT UNSIGNED NOT NULL,
  `plan_id`              BIGINT UNSIGNED NOT NULL,
  `status_id`            TINYINT UNSIGNED NOT NULL,
  `billing_cycle_id`     TINYINT UNSIGNED NOT NULL,
  `amount`               DECIMAL(10,2)  NOT NULL,
  `started_at`           DATE           NOT NULL,
  `current_period_start` DATE           NOT NULL,
  `current_period_end`   DATE           NOT NULL,
  `cancelled_at`         TIMESTAMP      NULL DEFAULT NULL,
  `notes`                TEXT           DEFAULT NULL,
  `created_at`           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subscriptions_business_index` (`business_id`),
  KEY `subscriptions_status_index` (`status_id`, `current_period_end`),
  KEY `subscriptions_plan_index` (`plan_id`),
  CONSTRAINT `subscriptions_business_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subscriptions_plan_fk`     FOREIGN KEY (`plan_id`)     REFERENCES `plans` (`id`),
  CONSTRAINT `subscriptions_status_fk`   FOREIGN KEY (`status_id`)   REFERENCES `subscription_statuses` (`id`),
  CONSTRAINT `subscriptions_cycle_fk`    FOREIGN KEY (`billing_cycle_id`) REFERENCES `billing_cycles` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `payments` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `subscription_id` BIGINT UNSIGNED DEFAULT NULL,
  `business_id`     BIGINT UNSIGNED NOT NULL,
  `amount`          DECIMAL(10,2)  NOT NULL,
  `method_id`       TINYINT UNSIGNED NOT NULL,
  `reference`       VARCHAR(191)   DEFAULT NULL,
  `status_id`       TINYINT UNSIGNED NOT NULL,
  `paid_on`         DATE           NOT NULL,
  `recorded_by`     BIGINT UNSIGNED DEFAULT NULL,
  `note`            TEXT           DEFAULT NULL,
  `created_at`      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payments_business_index` (`business_id`),
  KEY `payments_subscription_index` (`subscription_id`),
  KEY `payments_status_index` (`status_id`),
  KEY `payments_paid_on_index` (`paid_on`),
  CONSTRAINT `payments_subscription_fk` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_business_fk`     FOREIGN KEY (`business_id`)     REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_method_fk`       FOREIGN KEY (`method_id`)       REFERENCES `payment_methods` (`id`),
  CONSTRAINT `payments_status_fk`       FOREIGN KEY (`status_id`)       REFERENCES `payment_statuses` (`id`),
  CONSTRAINT `payments_recorded_by_fk`  FOREIGN KEY (`recorded_by`)     REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Reviews and private feedback
-- ---------------------------------------------------------------------------

CREATE TABLE `reviews` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id`    BIGINT UNSIGNED NOT NULL,
  `source_id`      TINYINT UNSIGNED NOT NULL,
  `status_id`      TINYINT UNSIGNED NOT NULL,
  `customer_name`  VARCHAR(160)   NOT NULL,
  `customer_email` VARCHAR(191)   DEFAULT NULL,
  `customer_phone` VARCHAR(32)    DEFAULT NULL,
  `rating`         TINYINT UNSIGNED NOT NULL,
  `title`          VARCHAR(191)   DEFAULT NULL,
  `comment`        TEXT           DEFAULT NULL,
  `replied_at`     TIMESTAMP      NULL DEFAULT NULL,
  `reply_text`     TEXT           DEFAULT NULL,
  `is_public`      TINYINT(1)     NOT NULL DEFAULT 1,
  `google_review_id` VARCHAR(191) DEFAULT NULL COMMENT 'for idempotent Google sync',
  `created_at`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_business_index` (`business_id`),
  KEY `reviews_status_index` (`status_id`),
  KEY `reviews_rating_index` (`rating`),
  KEY `reviews_created_at_index` (`created_at`),
  UNIQUE KEY `reviews_google_unique` (`business_id`, `google_review_id`),
  CONSTRAINT `reviews_business_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_source_fk`   FOREIGN KEY (`source_id`)   REFERENCES `review_sources` (`id`),
  CONSTRAINT `reviews_status_fk`   FOREIGN KEY (`status_id`)   REFERENCES `review_statuses` (`id`),
  CONSTRAINT `reviews_rating_check` CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE `feedback` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id` BIGINT UNSIGNED NOT NULL,
  `status_id`   TINYINT UNSIGNED NOT NULL,
  `name`        VARCHAR(160)   NOT NULL,
  `email`       VARCHAR(191)   DEFAULT NULL,
  `category`    VARCHAR(80)    NOT NULL DEFAULT 'general',
  `message`     TEXT           NOT NULL,
  `created_at`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `feedback_business_index` (`business_id`),
  KEY `feedback_status_index` (`status_id`),
  CONSTRAINT `feedback_business_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_status_fk`   FOREIGN KEY (`status_id`)   REFERENCES `feedback_statuses` (`id`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Analytics and Google sync
-- ---------------------------------------------------------------------------

-- Immutable daily rollup. One row per business per day per metric.
CREATE TABLE `business_daily_metrics` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id`  BIGINT UNSIGNED NOT NULL,
  `metric_date`  DATE           NOT NULL,
  `link_views`   INT UNSIGNED   NOT NULL DEFAULT 0,
  `qr_scans`     INT UNSIGNED   NOT NULL DEFAULT 0,
  `clicks`       INT UNSIGNED   NOT NULL DEFAULT 0,
  `submissions`  INT UNSIGNED   NOT NULL DEFAULT 0,
  `reviews`      INT UNSIGNED   NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_daily_metrics_unique` (`business_id`, `metric_date`),
  CONSTRAINT `business_daily_metrics_business_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `google_sync_logs` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id` BIGINT UNSIGNED NOT NULL,
  `added`       INT UNSIGNED   NOT NULL DEFAULT 0,
  `message`     VARCHAR(255)   NOT NULL,
  `ran_at`      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `google_sync_logs_business_index` (`business_id`, `ran_at`),
  CONSTRAINT `google_sync_logs_business_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------

-- Single-row table; `id` is pinned to 1.
CREATE TABLE `settings` (
  `id`                   TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `company_name`         VARCHAR(180)   NOT NULL DEFAULT 'GMBQYN',
  `support_email`        VARCHAR(191)   NOT NULL DEFAULT 'support@gmbqyn.in',
  `support_phone`        VARCHAR(32)    NOT NULL DEFAULT '',
  `currency`             CHAR(3)        NOT NULL DEFAULT 'INR',
  `trial_days`           SMALLINT UNSIGNED NOT NULL DEFAULT 14,
  `auto_renew`           TINYINT(1)     NOT NULL DEFAULT 0,
  `maintenance_mode`     TINYINT(1)     NOT NULL DEFAULT 0,
  `review_reminder_days` SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  `updated_at`           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `settings_singleton_check` CHECK (`id` = 1)
) ENGINE=InnoDB;

INSERT INTO `settings` (`id`) VALUES (1);

-- ---------------------------------------------------------------------------
-- Seed plans (matches lib/gmbqyn/plans.ts)
-- ---------------------------------------------------------------------------

INSERT INTO `plans`
  (`code`, `name`, `tagline`, `price_monthly`, `price_yearly`, `currency`,
   `review_link_enabled`, `qr_enabled`, `qr_custom_branding`, `feedback_enabled`,
   `analytics_enabled`, `google_sync`, `max_reviews_per_month`, `seats`,
   `sort_order`, `is_active`, `features`)
VALUES
  ('starter', 'Starter', 'Get reviews flowing on a budget.', 1499.00, 14990.00, 'INR',
   1, 1, 0, 0, 0, 0, 50, 1, 1, 1,
   JSON_ARRAY('Review link', 'QR code', '50 reviews / month', '1 seat', 'Email support')),

  ('growth', 'Growth', 'For teams serious about their rating.', 2999.00, 29990.00, 'INR',
   1, 1, 1, 1, 1, 0, 200, 3, 2, 1,
   JSON_ARRAY('Everything in Starter', 'Branded QR codes', 'Private feedback inbox', 'Analytics', '200 reviews / month', '3 seats', 'Priority support')),

  ('scale', 'Scale', 'Multi-location and API access.', 5999.00, 59990.00, 'INR',
   1, 1, 1, 1, 1, 1, NULL, 10, 3, 1,
   JSON_ARRAY('Everything in Growth', 'Google review sync', 'Unlimited reviews', '10 seats', 'Dedicated onboarding'));

-- ---------------------------------------------------------------------------
-- Seed accounts
-- Password for both: `password`  (bcrypt, cost 12 — regenerate before production)
-- ---------------------------------------------------------------------------

-- bcrypt hash placeholder — replace with output of:
--   php -r 'echo password_hash("password", PASSWORD_BCRYPT), PHP_EOL;'
SET @gmbqyn_demo_hash = '$2y$12$Zf0mY6Hq0Yl3Z1O5nQf1Uu9yXy4x8mS0nT2pQ7bR3vC6dE1gA0K';

INSERT INTO `users` (`role_id`, `status_id`, `name`, `email`, `phone`, `password`)
VALUES
  ((SELECT `id` FROM `roles` WHERE `name` = 'customer'), (SELECT `id` FROM `user_statuses` WHERE `name` = 'active'),
   'Demo Customer', 'customer@gmbqyn.in', '+919000000001', @gmbqyn_demo_hash),
  ((SELECT `id` FROM `roles` WHERE `name` = 'admin'), (SELECT `id` FROM `user_statuses` WHERE `name` = 'active'),
   'Master Admin', 'admin@gmbqyn.in', '+919000000002', @gmbqyn_demo_hash);

SET @gmbqyn_customer_id = (SELECT `id` FROM `users` WHERE `email` = 'customer@gmbqyn.in');

INSERT INTO `businesses` (`user_id`, `status_id`, `name`, `slug`, `category`, `city`, `state`, `country`, `phone`, `website`, `review_link_enabled`)
VALUES
  (@gmbqyn_customer_id, (SELECT `id` FROM `business_statuses` WHERE `name` = 'active'),
   'Spice Route', 'spice-route', 'Restaurant', 'Bengaluru', 'Karnataka', 'India', '+919000000003',
   'https://spiceroute.example', 1);

SET @gmbqyn_business_id = (SELECT `id` FROM `businesses` WHERE `slug` = 'spice-route');

INSERT INTO `review_links` (`business_id`, `slug`, `is_active`)
VALUES (@gmbqyn_business_id, 'spice-route', 1);

SET @gmbqyn_plan_id = (SELECT `id` FROM `plans` WHERE `code` = 'growth');

INSERT INTO `subscriptions`
  (`business_id`, `plan_id`, `status_id`, `billing_cycle_id`, `amount`,
   `started_at`, `current_period_start`, `current_period_end`)
VALUES
  (@gmbqyn_business_id, @gmbqyn_plan_id, (SELECT `id` FROM `subscription_statuses` WHERE `name` = 'active'),
   (SELECT `id` FROM `billing_cycles` WHERE `name` = 'monthly'), 2999.00,
   CURDATE(), CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH));

-- ---------------------------------------------------------------------------
-- Reporting views used by the admin dashboard
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW `v_mrr_by_plan` AS
SELECT
  p.`id`   AS `plan_id`,
  p.`code` AS `plan_code`,
  p.`name` AS `plan_name`,
  COUNT(s.`id`) AS `subscriptions`,
  COALESCE(SUM(s.`amount`), 0) AS `mrr`
FROM `plans` p
LEFT JOIN `subscriptions` s
  ON s.`plan_id` = p.`id`
 AND s.`status_id` = (SELECT `id` FROM `subscription_statuses` WHERE `name` IN ('trial', 'active'))
 AND s.`billing_cycle_id` = (SELECT `id` FROM `billing_cycles` WHERE `name` = 'monthly')
GROUP BY p.`id`, p.`code`, p.`name`;

CREATE OR REPLACE VIEW `v_business_live_stats` AS
SELECT
  b.`id` AS `business_id`,
  b.`name` AS `business_name`,
  b.`slug`,
  bs.`name` AS `status`,
  COUNT(r.`id`) AS `total_reviews`,
  COALESCE(ROUND(AVG(r.`rating`), 1), 0) AS `avg_rating`,
  SUM(CASE WHEN r.`status_id` = (SELECT `id` FROM `review_statuses` WHERE `name` = 'pending') THEN 1 ELSE 0 END) AS `pending_reviews`,
  rl.`clicks` AS `link_clicks`,
  rl.`submissions` AS `link_submissions`
FROM `businesses` b
JOIN `business_statuses` bs ON bs.`id` = b.`status_id`
LEFT JOIN `reviews` r        ON r.`business_id` = b.`id`
LEFT JOIN `review_links` rl  ON rl.`business_id` = b.`id`
GROUP BY b.`id`, b.`name`, b.`slug`, bs.`name`, rl.`clicks`, rl.`submissions`;

SET FOREIGN_KEY_CHECKS = 1;
