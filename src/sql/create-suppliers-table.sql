-- Criar tabela de fornecedores
CREATE TABLE IF NOT EXISTS public.suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  cnpj VARCHAR NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);

-- Criar índice para busca por CNPJ
CREATE INDEX IF NOT EXISTS idx_suppliers_cnpj ON public.suppliers(cnpj);

-- Grant permissions
GRANT ALL ON TABLE public.suppliers TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.suppliers_id_seq TO anon, authenticated, service_role;

-- Adicionar comentários
COMMENT ON TABLE public.suppliers IS 'Tabela de fornecedores do sistema';
COMMENT ON COLUMN public.suppliers.id IS 'ID único do fornecedor';
COMMENT ON COLUMN public.suppliers.name IS 'Nome/Razão Social do fornecedor';
COMMENT ON COLUMN public.suppliers.email IS 'E-mail de contato';
COMMENT ON COLUMN public.suppliers.phone IS 'Telefone de contato';
COMMENT ON COLUMN public.suppliers.cnpj IS 'CNPJ do fornecedor';
COMMENT ON COLUMN public.suppliers.address IS 'Endereço completo';
COMMENT ON COLUMN public.suppliers.notes IS 'Observações sobre o fornecedor';
COMMENT ON COLUMN public.suppliers.created_at IS 'Data de criação do registro';
