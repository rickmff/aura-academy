CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"full_name" text,
	"avatar_url" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
