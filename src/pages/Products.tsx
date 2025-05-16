
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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, AlertTriangle } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { useProducts } from "@/hooks/useProducts";

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
  const { products, loading, createProduct } = useProducts();
  
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
    minSellPrice: 0,
    profitMargin: 0,
    stock: 0,
    minStock: 0,
    supplier: "",
    location: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryFilter && categoryFilter !== "all") {
      return matchesSearch && product.category === categoryFilter;
    }
    
    return matchesSearch;
  });

  const handleAddProduct = async () => {
    if (!newProduct.code || !newProduct.name || !newProduct.category) {
      toast({
        title: "Erro ao adicionar produto",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProduct(newProduct);
      setIsAddDialogOpen(false);
      setNewProduct({
        code: "",
        name: "",
        category: "",
        brand: "",
        costPrice: 0,
        sellPrice: 0,
        minSellPrice: 0,
        profitMargin: 0,
        stock: 0,
        minStock: 0,
        supplier: "",
        location: "",
      });
      
      toast({
        title: "Produto adicionado",
        description: `${newProduct.name} foi adicionado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
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
            <ProductForm 
              product={newProduct}
              onChange={handleInputChange}
              onSubmit={handleAddProduct}
              categories={categories}
            />
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
              <SelectItem value="all">Todas as categorias</SelectItem>
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
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
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
