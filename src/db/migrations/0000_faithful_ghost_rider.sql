CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`avatar_icon` text DEFAULT '😊',
	`auth_provider` text NOT NULL,
	`auth_provider_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_users_auth` ON `users` (`auth_provider`,`auth_provider_id`);