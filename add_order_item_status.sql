-- Add status and cancelled_by columns to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS cancelled_by TEXT;

-- Update existing records to have ACTIVE status
UPDATE order_items 
SET status = 'ACTIVE' 
WHERE status IS NULL;

-- Add check constraints
ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_status_check;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_status_check 
CHECK (status IN ('ACTIVE', 'CANCELLED'));

ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS order_items_cancelled_by_check;

ALTER TABLE order_items 
ADD CONSTRAINT order_items_cancelled_by_check 
CHECK (cancelled_by IN ('DEALER', 'MANUFACTURER') OR cancelled_by IS NULL);
