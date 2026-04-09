CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'vendor', 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vendors_status_check'
  ) THEN
    ALTER TABLE vendors
      ADD CONSTRAINT vendors_status_check CHECK (status IN ('draft', 'submitted', 'approved', 'rejected'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'addresses_type_check'
  ) THEN
    ALTER TABLE addresses
      ADD CONSTRAINT addresses_type_check CHECK (type IN ('home', 'work', 'other'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'post_media_type_check'
  ) THEN
    ALTER TABLE post_media
      ADD CONSTRAINT post_media_type_check CHECK (type IN ('image', 'video'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS vendors_stall_name_trgm_idx
  ON vendors USING GIN (stall_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS menu_items_name_idx ON menu_items(name);

CREATE INDEX IF NOT EXISTS favorites_vendor_idx ON favorites(vendor_id);

CREATE INDEX IF NOT EXISTS post_comments_post_created_idx
  ON post_comments(post_id, created_at DESC);

CREATE INDEX IF NOT EXISTS reel_comments_reel_created_idx
  ON reel_comments(reel_id, created_at DESC);

DELETE FROM reviews a
USING reviews b
WHERE a.user_id = b.user_id
  AND a.vendor_id = b.vendor_id
  AND a.id < b.id;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_vendor_unique_idx
  ON reviews(user_id, vendor_id);