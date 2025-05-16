
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Inventory = () => {
  const { toast } = useToast();
  const { products, loading, createStockMovement } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [movementType, setMovementType] = useState<"entrada" | "saída">("entrada");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [document, setDocument] = useState("");
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMovement = async () => {
    if (!selectedProductId) {
      toast({
        title: "Erro ao registrar movimento",
        description: "Selecione um produto.",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!reason) {
      toast({
        title: "Motivo não informado",
        description: "Informe o motivo do movimento de estoque.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createStockMovement({
        product_id: selectedProductId,
        quantity,
        type: movementType,
        reason,
        document: document || undefined
      });
      
      setIsMovementDialogOpen(false);
      resetMovementForm();
    } catch (error) {
      console.error("Erro ao registrar movimento de estoque:", error);
    }
  };

  const resetMovementForm = () => {
    setSelectedProductId(null);
    setMovementType("entrada");
    setQuantity(1);
    setReason("");
    setDocument("");
  };

  const openAddMovementDialog = (productId: number) => {
    setSelectedProductId(productId);
    setIsMovementDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Estoque</h1>
      </div>

      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Buscar produtos..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center p-8 border rounded-lg">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Código:</span>
                <span>{product.code}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estoque Atual:</span>
                <span className={product.stock < product.minStock ? "text-red-500 font-medium" : ""}>{product.stock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estoque Mínimo:</span>
                <span>{product.minStock}</span>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setMovementType("saída");
                    openAddMovementDialog(product.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <ArrowDownLeft size={14} className="text-red-500" />
                  Saída
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setMovementType("entrada");
                    openAddMovementDialog(product.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <ArrowUpRight size={14} className="text-green-600" />
                  Entrada
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para registro de movimentação de estoque */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {movementType === "entrada" ? "Registrar Entrada" : "Registrar Saída"} de Estoque
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddMovement(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Produto</Label>
              <Select 
                value={selectedProductId?.toString() || ""} 
                onValueChange={(value) => setSelectedProductId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} ({product.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimentação</Label>
              <Select 
                value={movementType} 
                onValueChange={(value: "entrada" | "saída") => setMovementType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saída">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Informe o motivo da movimentação"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document">Documento (opcional)</Label>
              <Input
                id="document"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="Número da nota fiscal, pedido, etc."
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsMovementDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Registrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
