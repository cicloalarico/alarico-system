
-- Function to decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(product_id INT, amount INT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  SELECT stock INTO current_stock FROM products WHERE id = product_id;
  RETURN GREATEST(0, current_stock - amount);
END;
$$;

-- Function to increment stock
CREATE OR REPLACE FUNCTION increment_stock(product_id INT, amount INT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  SELECT stock INTO current_stock FROM products WHERE id = product_id;
  RETURN current_stock + amount;
END;
$$;
