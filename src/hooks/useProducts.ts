
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setProducts(data as Product[]);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error.message);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, "id" | "lastUpdated">) => {
    try {
      // Convert field names to match the database column names
      const dbProduct = {
        code: productData.code,
        name: productData.name,
        category: productData.category,
        brand: productData.brand,
        cost_price: productData.costPrice,
        sell_price: productData.sellPrice,
        min_sell_price: productData.minSellPrice,
        profit_margin: productData.profitMargin,
        stock: productData.stock,
        min_stock: productData.minStock,
        supplier: productData.supplier,
        location: productData.location,
      };

      console.log("Sending product data to Supabase:", dbProduct);
      
      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select();

      if (error) {
        throw error;
      }

      // Convert database column names back to camelCase for the frontend
      const newProduct: Product = {
        id: data[0].id,
        code: data[0].code,
        name: data[0].name,
        category: data[0].category,
        brand: data[0].brand,
        costPrice: data[0].cost_price,
        sellPrice: data[0].sell_price,
        minSellPrice: data[0].min_sell_price,
        profitMargin: data[0].profit_margin,
        stock: data[0].stock,
        minStock: data[0].min_stock,
        supplier: data[0].supplier,
        location: data[0].location,
        lastUpdated: data[0].last_updated
      };

      setProducts(prev => [...prev, newProduct]);

      toast({
        title: "Produto adicionado",
        description: `${productData.name} foi adicionado com sucesso.`,
      });
      
      return newProduct;
    } catch (error: any) {
      console.error("Erro ao criar produto:", error.message);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      // Convert field names to match the database column names
      const dbProduct: any = {};
      if (productData.code !== undefined) dbProduct.code = productData.code;
      if (productData.name !== undefined) dbProduct.name = productData.name;
      if (productData.category !== undefined) dbProduct.category = productData.category;
      if (productData.brand !== undefined) dbProduct.brand = productData.brand;
      if (productData.costPrice !== undefined) dbProduct.cost_price = productData.costPrice;
      if (productData.sellPrice !== undefined) dbProduct.sell_price = productData.sellPrice;
      if (productData.minSellPrice !== undefined) dbProduct.min_sell_price = productData.minSellPrice;
      if (productData.profitMargin !== undefined) dbProduct.profit_margin = productData.profitMargin;
      if (productData.stock !== undefined) dbProduct.stock = productData.stock;
      if (productData.minStock !== undefined) dbProduct.min_stock = productData.minStock;
      if (productData.supplier !== undefined) dbProduct.supplier = productData.supplier;
      if (productData.location !== undefined) dbProduct.location = productData.location;
      
      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Convert database response back to camelCase for the frontend
      const updatedProduct: Product = {
        id: data[0].id,
        code: data[0].code,
        name: data[0].name,
        category: data[0].category,
        brand: data[0].brand,
        costPrice: data[0].cost_price,
        sellPrice: data[0].sell_price,
        minSellPrice: data[0].min_sell_price,
        profitMargin: data[0].profit_margin,
        stock: data[0].stock,
        minStock: data[0].min_stock,
        supplier: data[0].supplier,
        location: data[0].location,
        lastUpdated: data[0].last_updated
      };

      setProducts(prev =>
        prev.map(product => (product.id === id ? { ...product, ...updatedProduct } : product))
      );

      toast({
        title: "Produto atualizado",
        description: `Produto atualizado com sucesso.`,
      });
      
      return updatedProduct;
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error.message);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      
      toast({
        title: "Produto removido",
        description: "Produto removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error.message);
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Hook para criar um movimento de estoque
  const createStockMovement = async (movementData: {
    product_id: number;
    quantity: number;
    type: "entrada" | "saída";
    reason: string;
    document?: string;
  }) => {
    try {
      const today = new Date();
      const date = today.toISOString().split('T')[0];
      const time = today.toTimeString().split(' ')[0];
      
      const dbMovement = {
        product_id: movementData.product_id,
        quantity: movementData.quantity,
        type: movementData.type,
        reason: movementData.reason,
        document: movementData.document || null,
        date,
        time,
        // Estamos usando o ID 1 como usuário padrão por enquanto
        user_id: 1
      };

      console.log("Sending stock movement to Supabase:", dbMovement);
      
      const { error } = await supabase
        .from('stock_movements')
        .insert([dbMovement]);

      if (error) {
        throw error;
      }

      // Atualiza o estoque do produto
      const productToUpdate = products.find(p => p.id === movementData.product_id);
      if (productToUpdate) {
        const newStock = movementData.type === "entrada"
          ? productToUpdate.stock + movementData.quantity
          : productToUpdate.stock - movementData.quantity;
        
        await updateProduct(movementData.product_id, { stock: newStock });
      }

      toast({
        title: "Movimento de estoque registrado",
        description: `${movementData.type === "entrada" ? "Entrada" : "Saída"} de estoque registrada com sucesso.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Erro ao registrar movimento de estoque:", error.message);
      toast({
        title: "Erro ao registrar movimento",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createStockMovement
  };
};
