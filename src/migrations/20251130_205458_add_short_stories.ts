import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_short_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__short_stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('twitter', 'instagram', 'bluesky', 'threads', 'facebook', 'goodreads', 'amazon', 'website', 'linkedin', 'youtube');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'authorHero';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'authorHero';
  CREATE TABLE "pages_blocks_latest_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Latest Works',
  	"description" varchar,
  	"count" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_recent_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Recent Thoughts',
  	"description" varchar,
  	"count" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_latest_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Latest Works',
  	"description" varchar,
  	"count" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_recent_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Recent Thoughts',
  	"description" varchar,
  	"count" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "short_stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_short_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_short_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__short_stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_author_bio" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_author_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_author_bio" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_author_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "short_stories_id" integer;
  ALTER TABLE "pages_blocks_latest_works" ADD CONSTRAINT "pages_blocks_latest_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_recent_posts" ADD CONSTRAINT "pages_blocks_recent_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_works" ADD CONSTRAINT "_pages_v_blocks_latest_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_recent_posts" ADD CONSTRAINT "_pages_v_blocks_recent_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "short_stories" ADD CONSTRAINT "short_stories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_short_stories_v" ADD CONSTRAINT "_short_stories_v_parent_id_short_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."short_stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_short_stories_v" ADD CONSTRAINT "_short_stories_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_latest_works_order_idx" ON "pages_blocks_latest_works" USING btree ("_order");
  CREATE INDEX "pages_blocks_latest_works_parent_id_idx" ON "pages_blocks_latest_works" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_works_path_idx" ON "pages_blocks_latest_works" USING btree ("_path");
  CREATE INDEX "pages_blocks_recent_posts_order_idx" ON "pages_blocks_recent_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_recent_posts_parent_id_idx" ON "pages_blocks_recent_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_recent_posts_path_idx" ON "pages_blocks_recent_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_latest_works_order_idx" ON "_pages_v_blocks_latest_works" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_latest_works_parent_id_idx" ON "_pages_v_blocks_latest_works" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_works_path_idx" ON "_pages_v_blocks_latest_works" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_recent_posts_order_idx" ON "_pages_v_blocks_recent_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_recent_posts_parent_id_idx" ON "_pages_v_blocks_recent_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_recent_posts_path_idx" ON "_pages_v_blocks_recent_posts" USING btree ("_path");
  CREATE INDEX "short_stories_meta_meta_image_idx" ON "short_stories" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "short_stories_slug_idx" ON "short_stories" USING btree ("slug");
  CREATE INDEX "short_stories_updated_at_idx" ON "short_stories" USING btree ("updated_at");
  CREATE INDEX "short_stories_created_at_idx" ON "short_stories" USING btree ("created_at");
  CREATE INDEX "short_stories__status_idx" ON "short_stories" USING btree ("_status");
  CREATE INDEX "_short_stories_v_parent_idx" ON "_short_stories_v" USING btree ("parent_id");
  CREATE INDEX "_short_stories_v_version_meta_version_meta_image_idx" ON "_short_stories_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_short_stories_v_version_version_slug_idx" ON "_short_stories_v" USING btree ("version_slug");
  CREATE INDEX "_short_stories_v_version_version_updated_at_idx" ON "_short_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_short_stories_v_version_version_created_at_idx" ON "_short_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_short_stories_v_version_version__status_idx" ON "_short_stories_v" USING btree ("version__status");
  CREATE INDEX "_short_stories_v_created_at_idx" ON "_short_stories_v" USING btree ("created_at");
  CREATE INDEX "_short_stories_v_updated_at_idx" ON "_short_stories_v" USING btree ("updated_at");
  CREATE INDEX "_short_stories_v_latest_idx" ON "_short_stories_v" USING btree ("latest");
  CREATE INDEX "_short_stories_v_autosave_idx" ON "_short_stories_v" USING btree ("autosave");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_author_image_id_media_id_fk" FOREIGN KEY ("hero_author_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_author_image_id_media_id_fk" FOREIGN KEY ("version_hero_author_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_short_stories_fk" FOREIGN KEY ("short_stories_id") REFERENCES "public"."short_stories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_author_image_idx" ON "pages" USING btree ("hero_author_image_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_author_image_idx" ON "_pages_v" USING btree ("version_hero_author_image_id");
  CREATE INDEX "payload_locked_documents_rels_short_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("short_stories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_latest_works" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_recent_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_latest_works" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_recent_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "short_stories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_short_stories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_social_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_latest_works" CASCADE;
  DROP TABLE "pages_blocks_recent_posts" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_works" CASCADE;
  DROP TABLE "_pages_v_blocks_recent_posts" CASCADE;
  DROP TABLE "short_stories" CASCADE;
  DROP TABLE "_short_stories_v" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_author_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_author_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_short_stories_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_hero_author_image_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_author_image_idx";
  DROP INDEX "payload_locked_documents_rels_short_stories_id_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_author_bio";
  ALTER TABLE "pages" DROP COLUMN "hero_author_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_author_bio";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_author_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "short_stories_id";
  DROP TYPE "public"."enum_short_stories_status";
  DROP TYPE "public"."enum__short_stories_v_version_status";
  DROP TYPE "public"."enum_footer_social_links_platform";`)
}
