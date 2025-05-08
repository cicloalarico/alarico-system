
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit, AlertTriangle } from "lucide-react";

// Mock product data
const initialProducts = [
  {
    id: 1,
    code: "BIC001",
    name: "Bicicleta Mountain Bike 29\"",
    category: "Bicicletas",
    brand: "Trek",
    costPrice: 1200.00,
    sellPrice: 1899.90,
    stock: 5,
    minStock: 2,
    supplier: "Trek Brasil",
  },
  {
    id: 2,
    code: "PEC001",
    name: "Pedal Plataforma Alumínio",
    category: "Componentes",
    brand: "Shimano",
    costPrice: 89.90,
    sellPrice: 139.90,
    stock: 15,
    minStock: 5,
    supplier: "Shimano Brasil",
  },
  {
    id: 3,
    code: "PNEU001",
    name: "Pneu MTB 29\" x 2.20",
    category: "Pneus",
    brand: "Michelin",
    costPrice: 79.90,
    sellPrice: 129.90,
    stock: 8,
    minStock: 10,
    supplier: "Michelin Importadora",
  },
  {
    id: 4,
    code: "CAP001",
    name: "Capacete MTB Ventilado",
    category: "Acessórios",
    brand: "Specialized",
    costPrice: 150.00,
    sellPrice: 249.90,
    stock: 12,
    minStock: 5,
    supplier: "Specialized Brasil",
  },
  {
    id: 5,
    code: "LUB001",
    name: "Lubrificante para Corrente 100ml",
    category: "Lubrificantes",
    brand: "WD-40 Bike",
    costPrice: 25.00,
    sellPrice: 39.90,
    stock: 3,
    minStock: 15,
    supplier: "WD-40 Brasil",
  },
];

const categories = [
  "Bicicletas",
  "Componentes",
  "Pneus",
  "Acessórios",
  "Lubrificantes",
  "Ferramentas",
  "Vestuário",
];

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    category: "",
    brand: "",
    costPrice: 0,
    sellPrice: 0,
    stock: 0,
    minStock: 0,
    supplier: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter) {
      return matchesSearch && product.category === categoryFilter;
    }
    
    return matchesSearch;
  });

  const handleAddProduct = () => {
    if (!newProduct.code || !newProduct.name || !newProduct.category) {
      toast({
        title: "Erro ao adicionar produto",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    setProducts([...products, { id, ...newProduct }]);
    setNewProduct({
      code: "",
      name: "",
      category: "",
      brand: "",
      costPrice: 0,
      sellPrice: 0,
      stock: 0,
      minStock: 0,
      supplier: "",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Produto adicionado",
      description: `${newProduct.name} foi adicionado com sucesso.`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ 
      ...newProduct, 
      [name]: name === "costPrice" || name === "sellPrice" || name === "stock" || name === "minStock"
        ? parseFloat(value) || 0
        : value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    name="code"
                    value={newProduct.code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                  >
                    <SelectTrigger>
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
                    value={newProduct.brand}
                    onChange={handleInputChange}
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
                    value={newProduct.costPrice}
                    onChange={handleInputChange}
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
                    value={newProduct.sellPrice}
                    onChange={handleInputChange}
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
                    value={newProduct.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Estoque Mínimo</Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    min="0"
                    value={newProduct.minStock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={newProduct.supplier}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProduct}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center border rounded-md px-3 py-2 flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            placeholder="Buscar por nome, código ou marca..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Marca</TableHead>
              <TableHead className="text-right">Preço (R$)</TableHead>
              <TableHead className="text-center">Estoque</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                  <TableCell className="text-right">
                    {product.sellPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <span className={`font-medium ${
                        product.stock < product.minStock ? "text-red-500" : "text-green-600"
                      }`}>
                        {product.stock}
                      </span>
                      {product.stock < product.minStock && (
                        <AlertTriangle size={16} className="ml-2 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Products;
