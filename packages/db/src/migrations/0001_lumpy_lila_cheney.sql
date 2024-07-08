ALTER TABLE `episode` RENAME COLUMN `file_name` TO `file_path`;--> statement-breakpoint
ALTER TABLE season ADD `streaming_link` text;--> statement-breakpoint
ALTER TABLE season ADD `streaming_icon_url` text;--> statement-breakpoint
ALTER TABLE `season` DROP COLUMN `dir_name`;