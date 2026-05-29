DO $$ BEGIN
 CREATE TYPE "channel_type" AS ENUM('SMS', 'WHATSAPP', 'CALL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "issue_type" AS ENUM('BLOCKING_VEHICLE', 'WRONG_PARKING', 'LIGHTS_ON', 'DOOR_OPEN', 'FLAT_TYRE', 'FLUID_LEAKING', 'VEHICLE_DAMAGE', 'EMERGENCY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "relay_status" AS ENUM('PENDING', 'DELIVERED', 'FAILED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "tag_status" AS ENUM('UNREGISTERED', 'ACTIVE', 'INACTIVE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag_id" uuid NOT NULL,
	"vehicle_id" uuid,
	"reporter_session_hash" text NOT NULL,
	"reporter_user_id" uuid,
	"issue_type" "issue_type" NOT NULL,
	"custom_note" text,
	"channel" "channel_type" NOT NULL,
	"relay_status" "relay_status" DEFAULT 'PENDING' NOT NULL,
	"owner_acknowledged" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otp_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_hash" text NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag_code" text NOT NULL,
	"vehicle_id" uuid,
	"owner_id" uuid,
	"status" "tag_status" DEFAULT 'UNREGISTERED' NOT NULL,
	"notify_sms" boolean DEFAULT true NOT NULL,
	"notify_whatsapp" boolean DEFAULT true NOT NULL,
	"call_enabled" boolean DEFAULT false NOT NULL,
	"activated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_tag_code_unique" UNIQUE("tag_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"notify_sms" boolean DEFAULT true NOT NULL,
	"notify_whatsapp" boolean DEFAULT true NOT NULL,
	"marketing_emails" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"phone_hash" text NOT NULL,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_hash_unique" UNIQUE("phone_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"colour" text NOT NULL,
	"plate_encrypted" text NOT NULL,
	"plate_partial" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_events_tag_idx" ON "contact_events" ("tag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_events_session_idx" ON "contact_events" ("reporter_session_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_events_created_at_idx" ON "contact_events" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "otp_attempts_phone_hash_idx" ON "otp_attempts" ("phone_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tags_tag_code_idx" ON "tags" ("tag_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_vehicle_idx" ON "tags" ("vehicle_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_owner_idx" ON "tags" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicles_owner_idx" ON "vehicles" ("owner_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_events" ADD CONSTRAINT "contact_events_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_events" ADD CONSTRAINT "contact_events_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contact_events" ADD CONSTRAINT "contact_events_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
