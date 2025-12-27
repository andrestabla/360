CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"action" varchar(255) NOT NULL,
	"resource" varchar(255),
	"resource_id" varchar(255),
	"details" json,
	"ip_address" varchar(50),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(20) DEFAULT 'dm' NOT NULL,
	"name" text,
	"title" text,
	"participants" json DEFAULT '[]'::json,
	"last_message" text,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"category" varchar(255),
	"unit_id" varchar(255),
	"owner_id" varchar(255),
	"status" varchar(50) DEFAULT 'DRAFT',
	"version" integer DEFAULT 1,
	"tags" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"provider" varchar(50) DEFAULT 'SMTP' NOT NULL,
	"smtp_host" varchar(255),
	"smtp_port" integer DEFAULT 587,
	"smtp_user" varchar(255),
	"smtp_password_encrypted" text,
	"smtp_secure" boolean DEFAULT false,
	"from_name" varchar(255),
	"from_email" varchar(255),
	"reply_to_email" varchar(255),
	"is_enabled" boolean DEFAULT false,
	"last_tested_at" timestamp,
	"last_test_result" boolean,
	"last_test_error" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"body_type" varchar(50) DEFAULT 'text',
	"attachments" json DEFAULT '[]'::json,
	"read_by" json DEFAULT '[]'::json,
	"reply_to_message_id" varchar(255),
	"reactions" json DEFAULT '[]'::json,
	"deleted_at" timestamp,
	"edited_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text DEFAULT 'My Organization' NOT NULL,
	"domains" json DEFAULT '[]'::json,
	"timezone" varchar(100) DEFAULT 'UTC',
	"locale" varchar(20) DEFAULT 'es',
	"branding" json DEFAULT '{}'::json,
	"policies" json DEFAULT '{}'::json,
	"sso_config" json,
	"storage_config" json,
	"integrations" json DEFAULT '[]'::json,
	"features" json DEFAULT '[]'::json,
	"sector" varchar(255),
	"contact_name" varchar(255),
	"contact_email" varchar(255),
	"contact_phone" varchar(100),
	"storage" varchar(50) DEFAULT '0 GB',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "surveys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'DRAFT',
	"questions" json DEFAULT '[]'::json,
	"responses" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_environment" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"environment" varchar(50) NOT NULL,
	"fingerprint" varchar(64) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parent_id" varchar(255),
	"manager_id" varchar(255),
	"level" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255),
	"role" varchar(100) NOT NULL,
	"level" integer DEFAULT 1,
	"unit" varchar(255),
	"initials" varchar(10),
	"bio" text,
	"phone" varchar(50),
	"location" varchar(255),
	"job_title" varchar(255),
	"language" varchar(20) DEFAULT 'es',
	"timezone" varchar(100),
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"avatar" text,
	"password" text,
	"must_change_password" boolean DEFAULT false,
	"invite_sent_at" timestamp,
	"invite_expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'DRAFT',
	"owner_id" varchar(255),
	"steps" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_documents_status" ON "documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_messages_conversation" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_messages_conversation_created" ON "messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status");