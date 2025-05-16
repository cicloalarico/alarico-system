
-- Função para decrementar estoque
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id integer, amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  current_stock integer;
BEGIN
  -- Obter o estoque atual
  SELECT stock INTO current_stock FROM products WHERE id = product_id;
  
  -- Retornar o valor decrementado
  RETURN current_stock - amount;
END;
$$;

-- Função para incrementar estoque
CREATE OR REPLACE FUNCTION public.increment_stock(product_id integer, amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  current_stock integer;
BEGIN
  -- Obter o estoque atual
  SELECT stock INTO current_stock FROM products WHERE id = product_id;
  
  -- Retornar o valor incrementado
  RETURN current_stock + amount;
END;
$$;
