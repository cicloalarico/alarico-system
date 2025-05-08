import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";

interface ProductFormProps {
  product: Partial<Product>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  categories: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onChange, 
  onSubmit,
  categories
}) => {
  // Calcular a margem de lucro quando o preço mínimo ou custo mudar
  const calculateProfitMargin = () => {
    if (!product.minSellPrice || !product.costPrice || product.costPrice === 0) return 0;
    return ((product.minSellPrice - product.costPrice) / product.costPrice) * 100;
  };

  // Atualizar o preço mínimo quando a margem de lucro mudar
  const handleMarginChange = (margin: number) => {
    if (!product.costPrice) return;
    const minSellPrice = product.costPrice * (1 + margin / 100);
    onChange("minSellPrice", minSellPrice);
    onChange("profitMargin", margin);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Código *</Label>
          <Input
            id="code"
            name="code"
            value={product.code || ""}
            onChange={(e) => onChange("code", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2 col-span-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            name="name"
            value={product.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select 
            value={product.category} 
            onValueChange={(value) => onChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            name="brand"
            value={product.brand || ""}
            onChange={(e) => onChange("brand", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            step="0.01"
            min="0"
            value={product.costPrice || 0}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              onChange("costPrice", value);
              // Recalculate minSellPrice based on the current profit margin
              if (product.profitMargin) {
                onChange("minSellPrice", value * (1 + product.profitMargin / 100));
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellPrice">Preço de Venda (R$)</Label>
          <Input
            id="sellPrice"
            name="sellPrice"
            type="number"
            step="0.01"
            min="0"
            value={product.sellPrice || 0}
            onChange={(e) => onChange("sellPrice", parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minSellPrice">Preço Mínimo de Venda (R$)</Label>
          <Input
            id="minSellPrice"
            name="minSellPrice"
            type="number"
            step="0.01"
            min="0"
            value={product.minSellPrice || 0}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              onChange("minSellPrice", value);
              // Recalcular a margem de lucro quando o preço mínimo mudar
              if (product.costPrice && product.costPrice > 0) {
                onChange("profitMargin", ((value - product.costPrice) / product.costPrice) * 100);
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profitMargin">Margem de Lucro (%)</Label>
          <Input
            id="profitMargin"
            name="profitMargin"
            type="number"
            step="0.1"
            min="0"
            value={product.profitMargin !== undefined ? product.profitMargin : 0}
            onChange={(e) => handleMarginChange(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Estoque Atual</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={product.stock || 0}
            onChange={(e) => onChange("stock", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Estoque Mínimo</Label>
          <Input
            id="minStock"
            name="minStock"
            type="number"
            min="0"
            value={product.minStock || 0}
            onChange={(e) => onChange("minStock", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Fornecedor</Label>
        <Input
          id="supplier"
          name="supplier"
          value={product.supplier || ""}
          onChange={(e) => onChange("supplier", e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {product.id ? "Atualizar produto" : "Adicionar produto"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
