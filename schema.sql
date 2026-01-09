


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."order_status" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REJECTED'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'UNPAID',
    'PARTIALLY_PAID',
    'PAID',
    'REFUNDED',
    'CANCELLED'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."products_fts_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.tsv :=
    setweight(
      to_tsvector('english', coalesce(NEW.name, '')),
      'A'
    );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."products_fts_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "password" "text" NOT NULL,
    "email" "text" NOT NULL,
    "mobile" "text" NOT NULL,
    "profile_image" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "carts_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "name" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "manufacturer_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dealer_application_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "manufacturer_id" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "approver_id" "uuid",
    "message" "text",
    CONSTRAINT "dealer_application_history_status_check" CHECK (("status" = ANY (ARRAY['PENDING'::"text", 'IN_REVIEW'::"text", 'REJECTED'::"text", 'APPROVED'::"text"])))
);


ALTER TABLE "public"."dealer_application_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dealers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "password_hash" "text" NOT NULL,
    "mobile" "text" NOT NULL,
    "is_email_verified" boolean DEFAULT false NOT NULL,
    "is_mobile_verified" boolean DEFAULT false NOT NULL,
    "is_onboarded" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "company_name" "text",
    "contact_person" "text",
    "gst_number" "text",
    "address" "text",
    "city" "text",
    "state" "text",
    "pincode" "text",
    "verification_document" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "company_logo" "text"
);


ALTER TABLE "public"."dealers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."manufacturer" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    "password_hash" "text" NOT NULL,
    "mobile" "text" NOT NULL,
    "company_name" "text",
    "company_logo" "text",
    "address" "text",
    "city" "text",
    "state" "text",
    "pincode" "text",
    "contact_person" "text",
    "website" "text",
    "gst_number" "text",
    "business_type" "text",
    "company_description" "text",
    "verification_document" "text",
    "is_verified" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "is_onboarded" boolean DEFAULT false NOT NULL,
    "is_email_verified" boolean DEFAULT false NOT NULL,
    "is_mobile_verified" boolean DEFAULT false NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "application_status" "text" DEFAULT 'PENDING'::"text" NOT NULL,
    "invoice_prefix" "text",
    "invoice_seq" bigint DEFAULT 0 NOT NULL,
    CONSTRAINT "manufacturer_application_status_check" CHECK (("application_status" = ANY (ARRAY['PENDING'::"text", 'IN_REVIEW'::"text", 'REJECTED'::"text", 'APPROVED'::"text"]))),
    CONSTRAINT "manufacturer_onboarded_fields_check" CHECK ((("is_onboarded" = false) OR (("company_name" IS NOT NULL) AND ("company_logo" IS NOT NULL) AND ("address" IS NOT NULL) AND ("city" IS NOT NULL) AND ("state" IS NOT NULL) AND ("pincode" IS NOT NULL) AND ("contact_person" IS NOT NULL) AND ("gst_number" IS NOT NULL) AND ("business_type" IS NOT NULL) AND ("company_description" IS NOT NULL) AND ("verification_document" IS NOT NULL))))
);


ALTER TABLE "public"."manufacturer" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."manufacturer_application_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "manufacturer_id" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "admin_id" "uuid",
    "message" "text",
    CONSTRAINT "manufacturer_application_history_status_check" CHECK (("status" = ANY (ARRAY['PENDING'::"text", 'IN_REVIEW'::"text", 'REJECTED'::"text", 'APPROVED'::"text"])))
);


ALTER TABLE "public"."manufacturer_application_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric(12,2) NOT NULL,
    "subtotal" numeric(12,2) GENERATED ALWAYS AS ((("quantity")::numeric * "price")) STORED NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'ACTIVE'::"text",
    "cancelled_by" "text",
    CONSTRAINT "order_items_cancelled_by_check" CHECK ((("cancelled_by" = ANY (ARRAY['DEALER'::"text", 'MANUFACTURER'::"text"])) OR ("cancelled_by" IS NULL))),
    CONSTRAINT "order_items_quantity_check" CHECK (("quantity" > 0)),
    CONSTRAINT "order_items_status_check" CHECK (("status" = ANY (ARRAY['ACTIVE'::"text", 'CANCELLED'::"text"])))
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "dealer_id" "uuid" NOT NULL,
    "manufacturer_id" "uuid" NOT NULL,
    "order_number" "text" NOT NULL,
    "invoice_number" "text" NOT NULL,
    "status" "public"."order_status" DEFAULT 'PENDING'::"public"."order_status" NOT NULL,
    "payment_status" "public"."payment_status" DEFAULT 'UNPAID'::"public"."payment_status" NOT NULL,
    "total_amount" numeric(12,2) DEFAULT 0.00 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "shipping_address" "text",
    "billing_address" "text",
    "notes" "text"
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "manufacturer_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "primary_image" "text",
    "images" "text"[] DEFAULT '{}'::"text"[],
    "sku" "text",
    "stock" integer DEFAULT 0 NOT NULL,
    "min_order_quantity" integer DEFAULT 1 NOT NULL,
    "in_stock" boolean DEFAULT true NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "regular_price" numeric(12,2) NOT NULL,
    "dealer_price" numeric(12,2) NOT NULL,
    "unit_id" "uuid",
    "category_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tsv" "tsvector"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sequences" (
    "name" "text" NOT NULL,
    "value" bigint DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."sequences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."unit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "manufacturer_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."unit" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_mobile_key" UNIQUE ("mobile");



ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dealer_application_history"
    ADD CONSTRAINT "dealer_application_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."dealers"
    ADD CONSTRAINT "dealers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."dealers"
    ADD CONSTRAINT "dealers_mobile_key" UNIQUE ("mobile");



ALTER TABLE ONLY "public"."dealers"
    ADD CONSTRAINT "dealers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."manufacturer_application_history"
    ADD CONSTRAINT "manufacturer_application_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."manufacturer"
    ADD CONSTRAINT "manufacturer_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."manufacturer"
    ADD CONSTRAINT "manufacturer_gst_number_key" UNIQUE ("gst_number");



ALTER TABLE ONLY "public"."manufacturer"
    ADD CONSTRAINT "manufacturer_mobile_key" UNIQUE ("mobile");



ALTER TABLE ONLY "public"."manufacturer"
    ADD CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sequences"
    ADD CONSTRAINT "sequences_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "uniq_cart_dealer_product" UNIQUE ("dealer_id", "product_id");



ALTER TABLE ONLY "public"."unit"
    ADD CONSTRAINT "unit_manufacturer_name_key" UNIQUE ("manufacturer_id", "name");



ALTER TABLE ONLY "public"."unit"
    ADD CONSTRAINT "unit_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_carts_dealer_id" ON "public"."carts" USING "btree" ("dealer_id");



CREATE INDEX "idx_categories_manufacturer_active" ON "public"."categories" USING "btree" ("manufacturer_id") WHERE ("is_active" = true);



CREATE INDEX "idx_dealer_application_history_created_at" ON "public"."dealer_application_history" USING "btree" ("created_at");



CREATE INDEX "idx_dealer_application_history_dealer_id" ON "public"."dealer_application_history" USING "btree" ("dealer_id");



CREATE INDEX "idx_dealer_application_history_manufacturer_id" ON "public"."dealer_application_history" USING "btree" ("manufacturer_id");



CREATE INDEX "idx_dealer_application_history_status" ON "public"."dealer_application_history" USING "btree" ("status");



CREATE INDEX "idx_dealer_manufacturer" ON "public"."dealer_application_history" USING "btree" ("dealer_id", "manufacturer_id");



CREATE INDEX "idx_dealers_active" ON "public"."dealers" USING "btree" ("is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_dealers_city" ON "public"."dealers" USING "btree" ("city");



CREATE INDEX "idx_dealers_state" ON "public"."dealers" USING "btree" ("state");



CREATE INDEX "idx_manufacturer_application_history_created_at" ON "public"."manufacturer_application_history" USING "btree" ("created_at");



CREATE INDEX "idx_manufacturer_application_history_manufacturer_id" ON "public"."manufacturer_application_history" USING "btree" ("manufacturer_id");



CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");



CREATE INDEX "idx_order_items_product_id" ON "public"."order_items" USING "btree" ("product_id");



CREATE INDEX "idx_orders_created_at" ON "public"."orders" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_orders_dealer_id" ON "public"."orders" USING "btree" ("dealer_id");



CREATE INDEX "idx_orders_invoice_number" ON "public"."orders" USING "btree" ("invoice_number");



CREATE INDEX "idx_orders_manufacturer_id" ON "public"."orders" USING "btree" ("manufacturer_id");



CREATE INDEX "idx_orders_order_number" ON "public"."orders" USING "btree" ("order_number");



CREATE INDEX "idx_orders_payment_status" ON "public"."orders" USING "btree" ("payment_status");



CREATE INDEX "idx_orders_status" ON "public"."orders" USING "btree" ("status");



CREATE INDEX "idx_products_active_instock" ON "public"."products" USING "btree" ("manufacturer_id") WHERE (("is_active" = true) AND ("in_stock" = true));



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category_id") WHERE ("is_active" = true);



CREATE INDEX "idx_products_fts" ON "public"."products" USING "gin" ("tsv");



CREATE INDEX "idx_products_manufacturer_id" ON "public"."products" USING "btree" ("manufacturer_id");



CREATE INDEX "idx_products_unit" ON "public"."products" USING "btree" ("unit_id");



CREATE UNIQUE INDEX "uniq_category_name_per_manufacturer" ON "public"."categories" USING "btree" ("manufacturer_id", "lower"("name"));



CREATE UNIQUE INDEX "uniq_dealers_gst" ON "public"."dealers" USING "btree" ("gst_number") WHERE ("gst_number" IS NOT NULL);



CREATE UNIQUE INDEX "uniq_orders_invoice_per_manufacturer" ON "public"."orders" USING "btree" ("manufacturer_id", "invoice_number");



CREATE UNIQUE INDEX "uniq_product_sku_per_manufacturer" ON "public"."products" USING "btree" ("manufacturer_id", "sku") WHERE ("sku" IS NOT NULL);



CREATE INDEX "unit_manufacturer_id_idx" ON "public"."unit" USING "btree" ("manufacturer_id");



CREATE OR REPLACE TRIGGER "products_fts_update" BEFORE INSERT OR UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."products_fts_trigger"();



CREATE OR REPLACE TRIGGER "trg_set_dealer_application_history_updated_at" BEFORE UPDATE ON "public"."dealer_application_history" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_set_updated_at" BEFORE UPDATE ON "public"."manufacturer" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_set_updated_at" BEFORE UPDATE ON "public"."unit" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "update_admin_updated_at" BEFORE UPDATE ON "public"."admin" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_carts_updated_at" BEFORE UPDATE ON "public"."carts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_categories_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_dealers_updated_at" BEFORE UPDATE ON "public"."dealers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dealer_application_history"
    ADD CONSTRAINT "dealer_application_history_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "public"."manufacturer"("id");



ALTER TABLE ONLY "public"."dealer_application_history"
    ADD CONSTRAINT "dealer_application_history_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."dealer_application_history"
    ADD CONSTRAINT "dealer_application_history_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."manufacturer_application_history"
    ADD CONSTRAINT "manufacturer_application_history_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id");



ALTER TABLE ONLY "public"."manufacturer_application_history"
    ADD CONSTRAINT "manufacturer_application_history_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "public"."dealers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."unit"
    ADD CONSTRAINT "unit_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturer"("id") ON DELETE CASCADE;



CREATE POLICY "Manufacturers can delete their own units" ON "public"."unit" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "manufacturer_id"));



CREATE POLICY "Manufacturers can insert their own units" ON "public"."unit" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "manufacturer_id"));



CREATE POLICY "Manufacturers can update their own units" ON "public"."unit" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "manufacturer_id")) WITH CHECK (("auth"."uid"() = "manufacturer_id"));



CREATE POLICY "Manufacturers can view their own units" ON "public"."unit" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "manufacturer_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





























































































































































































GRANT ALL ON FUNCTION "public"."products_fts_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."products_fts_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."products_fts_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";
























GRANT ALL ON TABLE "public"."admin" TO "anon";
GRANT ALL ON TABLE "public"."admin" TO "authenticated";
GRANT ALL ON TABLE "public"."admin" TO "service_role";



GRANT ALL ON TABLE "public"."carts" TO "anon";
GRANT ALL ON TABLE "public"."carts" TO "authenticated";
GRANT ALL ON TABLE "public"."carts" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."dealer_application_history" TO "anon";
GRANT ALL ON TABLE "public"."dealer_application_history" TO "authenticated";
GRANT ALL ON TABLE "public"."dealer_application_history" TO "service_role";



GRANT ALL ON TABLE "public"."dealers" TO "anon";
GRANT ALL ON TABLE "public"."dealers" TO "authenticated";
GRANT ALL ON TABLE "public"."dealers" TO "service_role";



GRANT ALL ON TABLE "public"."manufacturer" TO "anon";
GRANT ALL ON TABLE "public"."manufacturer" TO "authenticated";
GRANT ALL ON TABLE "public"."manufacturer" TO "service_role";



GRANT ALL ON TABLE "public"."manufacturer_application_history" TO "anon";
GRANT ALL ON TABLE "public"."manufacturer_application_history" TO "authenticated";
GRANT ALL ON TABLE "public"."manufacturer_application_history" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."sequences" TO "anon";
GRANT ALL ON TABLE "public"."sequences" TO "authenticated";
GRANT ALL ON TABLE "public"."sequences" TO "service_role";



GRANT ALL ON TABLE "public"."unit" TO "anon";
GRANT ALL ON TABLE "public"."unit" TO "authenticated";
GRANT ALL ON TABLE "public"."unit" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
