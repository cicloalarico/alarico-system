
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  Plus,
  MoreHorizontal,
  AlertCircle,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  ExternalLink,
  BarChart3,
  Clock,
  ArrowUpDown,
  Check,
  X,
  Filter,
} from "lucide-react";
import { LineChart } from "@/components/ui/charts";

// Dados iniciais dos produtos
const initialProducts = [
  {
    id: 1,
    code: "BIC001",
    name: "Mountain Bike Aro 29 Alumínio",
    category: "Bicicletas",
    supplier: "Trek",
    stock: 5,
    minStock: 2,
    price: 2499.90,
    cost: 1749.90,
    location: "A-01",
    lastUpdated: "2024-05-01",
  },
  {
    id: 2,
    code: "BIC002",
    name: "Bicicleta Speed Carbono",
    category: "Bicicletas",
    supplier: "Specialized",
    stock: 2,
    minStock: 1,
    price: 12999.90,
    cost: 9749.90,
    location: "A-02",
    lastUpdated: "2024-05-03",
  },
  {
    id: 3,
    code: "CAP001",
    name: "Capacete MTB Ventilado",
    category: "Acessórios",
    supplier: "Giro",
    stock: 8,
    minStock: 5,
    price: 349.90,
    cost: 209.90,
    location: "B-01",
    lastUpdated: "2024-04-28",
  },
  {
    id: 4,
    code: "PEC001",
    name: "Pedal Clip MTB",
    category: "Componentes",
    supplier: "Shimano",
    stock: 12,
    minStock: 5,
    price: 299.90,
    cost: 179.90,
    location: "C-03",
    lastUpdated: "2024-05-05",
  },
  {
    id: 5,
    code: "PEC002",
    name: "Câmbio Traseiro 12v",
    category: "Componentes",
    supplier: "Shimano",
    stock: 4,
    minStock: 3,
    price: 799.90,
    cost: 599.90,
    location: "C-02",
    lastUpdated: "2024-04-20",
  },
  {
    id: 6,
    code: "FER001",
    name: "Chave Allen Conjunto 10 peças",
    category: "Ferramentas",
    supplier: "Park Tool",
    stock: 3,
    minStock: 2,
    price: 199.90,
    cost: 119.90,
    location: "D-01",
    lastUpdated: "2024-05-02",
  },
  {
    id: 7,
    code: "LUB001",
    name: "Lubrificante para Corrente 120ml",
    category: "Manutenção",
    supplier: "Finish Line",
    stock: 1,
    minStock: 5,
    price: 59.90,
    cost: 29.90,
    location: "D-03",
    lastUpdated: "2024-04-25",
  },
];

// Dados de histórico de movimentações
const initialMovements = [
  {
    id: 1,
    productId: 1,
    date: "2024-05-01",
    time: "14:30",
    type: "entrada",
    quantity: 2,
    reason: "Compra",
    document: "NF 12345",
    user: "admin",
  },
  {
    id: 2,
    productId: 3,
    date: "2024-04-28",
    time: "10:15",
    type: "entrada",
    quantity: 5,
    reason: "Compra",
    document: "NF 12340",
    user: "admin",
  },
  {
    id: 3,
    productId: 7,
    date: "2024-04-25",
    time: "16:45",
    type: "entrada",
    quantity: 10,
    reason: "Compra",
    document: "NF 12338",
    user: "admin",
  },
  {
    id: 4,
    productId: 7,
    date: "2024-05-02",
    time: "09:20",
    type: "saída",
    quantity: 3,
    reason: "Venda",
    document: "Venda #351",
    user: "vendedor",
  },
  {
    id: 5,
    productId: 7,
    date: "2024-05-03",
    time: "10:30",
    type: "saída",
    quantity: 2,
    reason: "Venda",
    document: "Venda #356",
    user: "vendedor",
  },
  {
    id: 6,
    productId: 7,
    date: "2024-05-05",
    time: "15:10",
    type: "saída",
    quantity: 4,
    reason: "Venda",
    document: "Venda #362",
    user: "vendedor",
  },
];

// Categorias disponíveis
const categories = [
  "Bicicletas",
  "Acessórios",
  "Componentes",
  "Vestuário",
  "Ferramentas",
  "Manutenção",
];

// Fornecedores disponíveis
const suppliers = [
  "Trek",
  "Specialized",
  "Shimano",
  "SRAM",
  "Caloi",
  "Giro",
  "Park Tool",
  "Finish Line",
];

// Dados para o gráfico
const stockChartData = [
  { date: "Jan", "Em Estoque": 75, "Mínimo": 50 },
  { date: "Fev", "Em Estoque": 82, "Mínimo": 50 },
  { date: "Mar", "Em Estoque": 98, "Mínimo": 50 },
  { date: "Abr", "Em Estoque": 65, "Mínimo": 50 },
  { date: "Mai", "Em Estoque": 35, "Mínimo": 50 },
];

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false);
  const [isManageProductOpen, setIsManageProductOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: "",
    direction: "asc",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [isViewHistoryOpen, setIsViewHistoryOpen] = useState(false);

  // Estado para novo movimento de estoque
  const [newMovement, setNewMovement] = useState({
    productId: 0,
    type: "entrada",
    quantity: 1,
    reason: "Compra",
    document: "",
  });

  // Estado para gerenciar produto
  const [productForm, setProductForm] = useState({
    id: 0,
    code: "",
    name: "",
    category: "",
    supplier: "",
    stock: 0,
    minStock: 0,
    price: 0,
    cost: 0,
    location: "",
  });

  // Filtra produtos com base nos filtros aplicados
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    // Filtro de estoque
    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = product.stock <= product.minStock;
    } else if (stockFilter === "out") {
      matchesStock = product.stock === 0;
    }
    
    // Filtro de aba
    if (activeTab === "all") {
      return matchesSearch && matchesCategory && matchesStock;
    } else if (activeTab === "low") {
      return matchesSearch && matchesCategory && product.stock <= product.minStock;
    } else if (activeTab === "recent") {
      // Considere "recente" produtos atualizados nos últimos 7 dias
      const lastUpdated = new Date(product.lastUpdated);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && matchesCategory && lastUpdated >= sevenDaysAgo;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Ordena produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Manipula a ordenação ao clicar em um cabeçalho da tabela
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtra movimentações do produto selecionado
  const productMovements = movements.filter(
    (movement) => movement.productId === selectedProduct?.id
  ).sort((a, b) => {
    // Ordenar por data e hora, mais recentes primeiro
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  // Manipula a adição de um novo movimento de estoque
  const handleAddMovement = () => {
    if (!newMovement.productId || newMovement.quantity <= 0 || !newMovement.reason) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === newMovement.productId);
    if (!product) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      });
      return;
    }

    // Calcula novo estoque
    let newStock = product.stock;
    if (newMovement.type === "entrada") {
      newStock += newMovement.quantity;
    } else {
      newStock -= newMovement.quantity;
      if (newStock < 0) {
        toast({
          title: "Erro",
          description: "Quantidade em estoque insuficiente",
          variant: "destructive",
        });
        return;
      }
    }

    // Atualiza estoque do produto
    const updatedProducts = products.map((p) =>
      p.id === newMovement.productId
        ? { ...p, stock: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    );
    setProducts(updatedProducts);

    // Adiciona movimento ao histórico
    const newMovementEntry = {
      id: movements.length + 1,
      productId: newMovement.productId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      type: newMovement.type,
      quantity: newMovement.quantity,
      reason: newMovement.reason,
      document: newMovement.document,
      user: "admin", // Usuário logado fixo para exemplo
    };
    setMovements([...movements, newMovementEntry]);

    // Reset do formulário
    setNewMovement({
      productId: 0,
      type: "entrada",
      quantity: 1,
      reason: "Compra",
      document: "",
    });

    setIsAddMovementOpen(false);

    toast({
      title: `${newMovement.type === "entrada" ? "Entrada" : "Saída"} registrada`,
      description: `${newMovement.quantity} unidades ${
        newMovement.type === "entrada" ? "adicionadas ao" : "removidas do"
      } estoque`,
    });
  };

  // Manipula a abertura do modal de movimentação de estoque
  const handleOpenAddMovement = (product: any) => {
    setSelectedProduct(product);
    setNewMovement({
      ...newMovement,
      productId: product.id,
    });
    setIsAddMovementOpen(true);
  };

  // Manipula a abertura do modal de gerenciamento de produto
  const handleOpenManageProduct = (product?: any) => {
    if (product) {
      setProductForm({
        id: product.id,
        code: product.code,
        name: product.name,
        category: product.category,
        supplier: product.supplier,
        stock: product.stock,
        minStock: product.minStock,
        price: product.price,
        cost: product.cost,
        location: product.location,
      });
    } else {
      setProductForm({
        id: 0,
        code: "",
        name: "",
        category: "",
        supplier: "",
        stock: 0,
        minStock: 0,
        price: 0,
        cost: 0,
        location: "",
      });
    }
    setIsManageProductOpen(true);
  };

  // Manipula o salvamento de um produto
  const handleSaveProduct = () => {
    if (!productForm.code || !productForm.name || !productForm.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (productForm.id === 0) {
      // Novo produto
      const newProduct = {
        ...productForm,
        id: Math.max(...products.map((p) => p.id)) + 1,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Produto adicionado",
        description: `${productForm.name} foi adicionado ao inventário`,
      });
    } else {
      // Atualização de produto existente
      const updatedProducts = products.map((p) =>
        p.id === productForm.id
          ? { ...p, ...productForm, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      );
      setProducts(updatedProducts);
      toast({
        title: "Produto atualizado",
        description: `${productForm.name} foi atualizado`,
      });
    }

    setIsManageProductOpen(false);
  };

  // Manipula a abertura do histórico de movimentações
  const handleViewHistory = (product: any) => {
    setSelectedProduct(product);
    setIsViewHistoryOpen(true);
  };

  // Calcular produtos com estoque baixo
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  
  // Calcular produtos sem estoque
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Calcular valor total em estoque
  const totalStockValue = products.reduce((sum, product) => {
    return sum + product.stock * product.cost;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Estoque</h1>
        <Button onClick={() => handleOpenManageProduct()} className="flex items-center gap-1">
          <Plus size={16} /> Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{products.length}</div>
              <Package className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Produtos sem Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{outOfStockCount}</div>
              <X className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Valor Total em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução do Estoque</CardTitle>
          <CardDescription>Quantidade total de itens em estoque vs. estoque mínimo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <LineChart
              data={stockChartData}
              index="date"
              categories={["Em Estoque", "Mínimo"]}
              colors={["#3b82f6", "#ef4444"]}
              valueFormatter={(value: number) => `${value} unidades`}
              showLegend={true}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-12 gap-4">
        <div className="md:col-span-5 lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="flex items-center border rounded-md px-3 py-2">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              placeholder="Buscar produto por nome ou código..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stock-filter">Status de Estoque</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger id="stock-filter">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="low">Estoque Baixo</SelectItem>
                  <SelectItem value="out">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setStockFilter("all");
              }}
            >
              <Filter className="mr-2 h-4 w-4" /> Limpar Filtros
            </Button>
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 xl:col-span-9 space-y-4">
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos os Produtos</TabsTrigger>
              <TabsTrigger value="low">Estoque Baixo</TabsTrigger>
              <TabsTrigger value="recent">Atualiz. Recentes</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("code")}
                        >
                          Código
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          Nome
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead className="hidden lg:table-cell">Fornecedor</TableHead>
                      <TableHead className="text-center">
                        <div 
                          className="flex items-center justify-center cursor-pointer"
                          onClick={() => handleSort("stock")}
                        >
                          Estoque
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right hidden md:table-cell">Preço</TableHead>
                      <TableHead className="text-center w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.category}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {product.supplier}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center items-center">
                              {product.stock === 0 ? (
                                <Badge variant="destructive">Sem estoque</Badge>
                              ) : product.stock <= product.minStock ? (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  {product.stock} un
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  {product.stock} un
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenAddMovement(product)}>
                                  <ArrowDownCircle className="mr-2 h-4 w-4 text-green-600" />
                                  <span>Entrada</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenAddMovement(product)}>
                                  <ArrowUpCircle className="mr-2 h-4 w-4 text-amber-600" />
                                  <span>Saída</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewHistory(product)}>
                                  <History className="mr-2 h-4 w-4" />
                                  <span>Histórico</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenManageProduct(product)}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  <span>Gerenciar</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="low" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead className="text-center">Estoque</TableHead>
                      <TableHead className="text-center">Estoque Min</TableHead>
                      <TableHead className="text-center w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhum produto com estoque baixo encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.category}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center items-center">
                              {product.stock === 0 ? (
                                <Badge variant="destructive">Sem estoque</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  {product.stock} un
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{product.minStock} un</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenAddMovement(product)}
                              className="w-full"
                            >
                              <ArrowDownCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>Entrada</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-center">Estoque</TableHead>
                      <TableHead>Atualização</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Nenhuma atualização recente encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center items-center">
                              {product.stock === 0 ? (
                                <Badge variant="destructive">Sem estoque</Badge>
                              ) : product.stock <= product.minStock ? (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  {product.stock} un
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  {product.stock} un
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{new Date(product.lastUpdated).toLocaleDateString('pt-BR')}</span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewHistory(product)}
                              className="w-full"
                            >
                              <History className="mr-2 h-4 w-4" />
                              <span>Histórico</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog para adicionar movimento de estoque */}
      <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newMovement.type === "entrada" ? "Entrada" : "Saída"} de Estoque
            </DialogTitle>
            <DialogDescription>
              Produto: {selectedProduct?.name} ({selectedProduct?.code})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Button
                  variant={newMovement.type === "entrada" ? "default" : "outline"}
                  className={`flex items-center justify-center gap-2 ${
                    newMovement.type === "entrada" ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                  onClick={() => setNewMovement({ ...newMovement, type: "entrada" })}
                >
                  <ArrowDownCircle className="h-4 w-4" />
                  Entrada
                </Button>
                <Button
                  variant={newMovement.type === "saída" ? "default" : "outline"}
                  className={`flex items-center justify-center gap-2 ${
                    newMovement.type === "saída" ? "bg-amber-600 hover:bg-amber-700" : ""
                  }`}
                  onClick={() => setNewMovement({ ...newMovement, type: "saída" })}
                >
                  <ArrowUpCircle className="h-4 w-4" />
                  Saída
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newMovement.quantity}
                onChange={(e) =>
                  setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Select
                value={newMovement.reason}
                onValueChange={(value) => setNewMovement({ ...newMovement, reason: value })}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {newMovement.type === "entrada" ? (
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
                value={newMovement.document}
                onChange={(e) => setNewMovement({ ...newMovement, document: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMovementOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMovement}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar produto */}
      <Dialog open={isManageProductOpen} onOpenChange={setIsManageProductOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {productForm.id ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código*</Label>
                <Input
                  id="code"
                  value={productForm.code}
                  onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome*</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Select
                value={productForm.supplier}
                onValueChange={(value) => setProductForm({ ...productForm, supplier: value })}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço de Venda (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Custo (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.cost}
                  onChange={(e) =>
                    setProductForm({ ...productForm, cost: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque Atual</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={productForm.minStock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, minStock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={productForm.location}
                  onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                  placeholder="Ex: A-01"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageProductOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct}>
              {productForm.id ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar histórico de movimentações */}
      <Dialog open={isViewHistoryOpen} onOpenChange={setIsViewHistoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Histórico de Movimentações</DialogTitle>
            <DialogDescription>
              Produto: {selectedProduct?.name} ({selectedProduct?.code})
            </DialogDescription>
          </DialogHeader>
          <div>
            {productMovements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma movimentação registrada para este produto
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="hidden md:table-cell">Doc.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div>{movement.date.split('-').reverse().join('/')}</div>
                          <div className="text-xs text-gray-500">{movement.time}</div>
                        </TableCell>
                        <TableCell>
                          {movement.type === "entrada" ? (
                            <div className="flex items-center text-green-600">
                              <ArrowDownCircle className="mr-1 h-4 w-4" />
                              <span>Entrada</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <ArrowUpCircle className="mr-1 h-4 w-4" />
                              <span>Saída</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-medium">{movement.quantity}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell className="hidden md:table-cell">{movement.document}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewHistoryOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
