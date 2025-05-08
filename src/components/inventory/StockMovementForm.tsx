
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
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Product } from "@/types";

interface StockMovementFormProps {
  products: Product[];
  selectedProductId: number;
  type: "entrada" | "saída";
  quantity: number;
  reason: string;
  document: string;
  onChangeProduct: (productId: number) => void;
  onChangeType: (type: "entrada" | "saída") => void;
  onChangeQuantity: (quantity: number) => void;
  onChangeReason: (reason: string) => void;
  onChangeDocument: (document: string) => void;
  onSubmit: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  products,
  selectedProductId,
  type,
  quantity,
  reason,
  document,
  onChangeProduct,
  onChangeType,
  onChangeQuantity,
  onChangeReason,
  onChangeDocument,
  onSubmit,
}) => {
  const selectedProduct = products.find(p => p.id === selectedProductId);
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product">Produto *</Label>
        <Select
          value={selectedProductId ? String(selectedProductId) : ""}
          onValueChange={(value) => onChangeProduct(parseInt(value))}
        >
          <SelectTrigger id="product">
            <SelectValue placeholder="Selecione o produto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={String(product.id)}>
                {product.code} - {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <p><span className="font-medium">Estoque atual:</span> {selectedProduct.stock} unidades</p>
          <p><span className="font-medium">Estoque mínimo:</span> {selectedProduct.minStock} unidades</p>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={type === "entrada" ? "default" : "outline"}
            className={`flex items-center justify-center gap-2 ${
              type === "entrada" ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={() => onChangeType("entrada")}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Entrada
          </Button>
          <Button
            type="button"
            variant={type === "saída" ? "default" : "outline"}
            className={`flex items-center justify-center gap-2 ${
              type === "saída" ? "bg-amber-600 hover:bg-amber-700" : ""
            }`}
            onClick={() => onChangeType("saída")}
          >
            <ArrowUpCircle className="h-4 w-4" />
            Saída
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onChangeQuantity(parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo *</Label>
        <Select value={reason} onValueChange={onChangeReason}>
          <SelectTrigger id="reason">
            <SelectValue placeholder="Selecione o motivo" />
          </SelectTrigger>
          <SelectContent>
            {type === "entrada" ? (
              <>
                <SelectItem value="Compra">Compra</SelectItem>
                <SelectItem value="Devolução">Devolução</SelectItem>
                <SelectItem value="Ajuste de Inventário">Ajuste de Inventário</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="Venda">Venda</SelectItem>
                <SelectItem value="Defeito">Defeito</SelectItem>
                <SelectItem value="Uso Interno">Uso Interno</SelectItem>
                <SelectItem value="Ajuste de Inventário">Ajuste de Inventário</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">Documento/Referência</Label>
        <Input
          id="document"
          placeholder="Nota fiscal, pedido, etc."
          value={document}
          onChange={(e) => onChangeDocument(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">Confirmar</Button>
      </div>
    </form>
  );
};

export default StockMovementForm;
