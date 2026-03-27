-- Add bharty_types column to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS bharty_types JSONB;

-- Add bharty_types column to sliders table
ALTER TABLE sliders ADD COLUMN IF NOT EXISTS bharty_types JSONB;
