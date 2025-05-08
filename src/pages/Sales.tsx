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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Printer,
  ShoppingCart,
  CreditCard,
  Banknote,
  Receipt,
  User,
  X,
  ChevronDown,
  CalendarIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

// Mock sales data
const initialSales = [
  {
    id: 1,
    date: "2024-05-07",
    customer: "João Silva",
    paymentMethod: "Cartão de Crédito",
    status: "Concluída",
    total: 1899.90,
    items: [
      { id: 1, name: "Bicicleta Mountain Bike 29\"", quantity: 1, price: 1899.90, subtotal: 1899.90 }
    ]
  },
  {
    id: 2,
    date: "2024-05-06",
    customer: "Maria Oliveira",
    paymentMethod: "Dinheiro",
    status: "Concluída",
    total: 219.80,
    items: [
      { id: 1, name: "Capacete MTB Ventilado", quantity: 1, price: 249.90, subtotal: 249.90 },
      { id: 2, name: "Lubrificante para Corrente 100ml", quantity: 2, price: 39.90, subtotal: 79.80 },
      { id: 3, name: "Desconto Promocional", quantity: 1, price: -109.90, subtotal: -109.90 }
    ]
  },
  {
    id: 3,
    date: "2024-05-05",
    customer: "Carlos Santos",
    paymentMethod: "Pix",
    status: "Concluída",
    total: 529.70,
    items: [
      { id: 1, name: "Pedal Plataforma Alumínio", quantity: 2, price: 139.90, subtotal: 279.80 },
      { id: 2, name: "Pneu MTB 29\" x 2.20", quantity: 2, price: 129.90, subtotal: 259.80 },
      { id: 3, name: "Desconto à Vista", quantity: 1, price: -9.90, subtotal: -9.90 }
    ]
  },
  {
    id: 4,
    date: "2024-05-08",
    customer: "Ana Ferreira",
    paymentMethod: "Cartão de Débito",
    status: "Aguardando Pagamento",
    total: 139.90,
    items: [
      { id: 1, name: "Pedal Plataforma Alumínio", quantity: 1, price: 139.90, subtotal: 139.90 }
    ]
  },
  {
    id: 5,
    date: "2024-05-07",
    customer: "Roberto Almeida",
    paymentMethod: "Cartão de Crédito",
    status: "Cancelada",
    total: 249.90,
    items: [
      { id: 1, name: "Capacete MTB Ventilado", quantity: 1, price: 249.90, subtotal: 249.90 }
    ]
  }
];

// Mock products data
const products = [
  {
    id: 1,
    code: "BIC001",
    name: "Bicicleta Mountain Bike 29\"",
    price: 1899.90,
    stock: 5,
  },
  {
    id: 2,
    code: "PEC001",
    name: "Pedal Plataforma Alumínio",
    price: 139.90,
    stock: 15,
  },
  {
    id: 3,
    code: "PNEU001",
    name: "Pneu MTB 29\" x 2.20",
    price: 129.90,
    stock: 8,
  },
  {
    id: 4,
    code: "CAP001",
    name: "Capacete MTB Ventilado",
    price: 249.90,
    stock: 12,
  },
  {
    id: 5,
    code: "LUB001",
    name: "Lubrificante para Corrente 100ml",
    price: 39.90,
    stock: 3,
  },
];

// Mock customers data
const customers = [
  { id: 1, name: "João Silva", cpf: "123.456.789-00" },
  { id: 2, name: "Maria Oliveira", cpf: "987.654.321-00" },
  { id: 3, name: "Carlos Santos", cpf: "456.789.123-00" },
  { id: 4, name: "Ana Ferreira", cpf: "789.123.456-00" },
  { id: 5, name: "Roberto Almeida", cpf: "321.654.987-00" },
];

const paymentMethods = [
  "Dinheiro",
  "Cartão de Débito",
  "Cartão de Crédito",
  "Pix",
  "Transferência Bancária",
  "Boleto",
];

const Sales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState(initialSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  
  // New sale state
  const [newSale, setNewSale] = useState({
    customer: "",
    customerId: 0,
    paymentMethod: "",
    items: [] as { id: number; productId: number; name: string; quantity: number; price: number; subtotal: number }[],
    discount: 0,
    total: 0,
  });
  
  const [searchedProducts, setSearchedProducts] = useState<any[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? sale.status === statusFilter : true;
    
    // Date filtering
    let matchesDate = true;
    if (dateRange.from) {
      const saleDate = new Date(sale.date);
      const fromDate = dateRange.from;
      
      // If there's an end date, check if the sale date is within range
      if (dateRange.to) {
        const toDate = dateRange.to;
        matchesDate = saleDate >= fromDate && saleDate <= toDate;
      } else {
        // If there's only a start date, check if the sale date is after or equal to it
        matchesDate = saleDate >= fromDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getTotalFilteredAmount = () => {
    return filteredSales
      .filter(sale => sale.status === "Concluída")
      .reduce((sum, sale) => sum + sale.total, 0);
  };

  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
    setIsViewDialogOpen(true);
  };

  const handleSearchProduct = () => {
    if (productSearchTerm.length < 2) {
      setSearchedProducts([]);
      return;
    }
    
    const results = products.filter(
      product => 
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
    
    setSearchedProducts(results);
  };

  const handleAddItemToSale = () => {
    if (!selectedProduct || quantity <= 0) {
      toast({
        title: "Erro ao adicionar item",
        description: "Selecione um produto e uma quantidade válida.",
        variant: "destructive",
      });
      return;
    }
    
    const subtotal = selectedProduct.price * quantity;
    
    const newItem = {
      id: newSale.items.length + 1,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      quantity: quantity,
      price: selectedProduct.price,
      subtotal: subtotal
    };
    
    const updatedItems = [...newSale.items, newItem];
    
    // Calculate new total
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0) - newSale.discount;
    
    setNewSale({
      ...newSale,
      items: updatedItems,
      total: newTotal
    });
    
    // Clear product selection
    setSelectedProduct(null);
    setQuantity(1);
    setProductSearchTerm("");
    setSearchedProducts([]);
    setIsProductSearchOpen(false);
    
    toast({
      title: "Item adicionado",
      description: `${selectedProduct.name} adicionado à venda.`,
    });
  };

  const handleRemoveItemFromSale = (itemId: number) => {
    const updatedItems = newSale.items.filter(item => item.id !== itemId);
    
    // Calculate new total
    const newTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0) - newSale.discount;
    
    setNewSale({
      ...newSale,
      items: updatedItems,
      total: newTotal
    });
    
    toast({
      title: "Item removido",
      description: "Item removido da venda.",
    });
  };

  const handleApplyDiscount = (discountValue: number) => {
    const itemsTotal = newSale.items.reduce((sum, item) => sum + item.subtotal, 0);
    const newTotal = itemsTotal - discountValue;
    
    setNewSale({
      ...newSale,
      discount: discountValue,
      total: newTotal >= 0 ? newTotal : 0
    });
  };

  const handleCompleteSale = () => {
    if (!newSale.customer || !newSale.paymentMethod || newSale.items.length === 0) {
      toast({
        title: "Erro ao finalizar venda",
        description: "Por favor, selecione um cliente, método de pagamento e adicione itens.",
        variant: "destructive",
      });
      return;
    }

    const id = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const date = new Date().toISOString().split('T')[0];
    const customerObj = customers.find(c => c.id === newSale.customerId);
    const customerName = customerObj ? customerObj.name : newSale.customer;
    
    const newSaleRecord = {
      id,
      date,
      customer: customerName,
      paymentMethod: newSale.paymentMethod,
      status: "Concluída",
      total: newSale.total,
      items: newSale.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }))
    };
    
    if (newSale.discount > 0) {
      newSaleRecord.items.push({
        id: newSaleRecord.items.length + 1,
        name: "Desconto Aplicado",
        quantity: 1,
        price: -newSale.discount,
        subtotal: -newSale.discount
      });
    }
    
    setSales([newSaleRecord, ...sales]);
    
    // Reset new sale form
    setNewSale({
      customer: "",
      customerId: 0,
      paymentMethod: "",
      items: [],
      discount: 0,
      total: 0,
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Venda concluída",
      description: `Venda no valor de R$ ${newSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} registrada com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente *</Label>
                  <Select 
                    value={newSale.customer} 
                    onValueChange={(value) => {
                      const customerObj = customers.find(c => c.id === parseInt(value));
                      setNewSale({
                        ...newSale, 
                        customer: customerObj ? customerObj.name : "",
                        customerId: parseInt(value)
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                  <Select 
                    value={newSale.paymentMethod} 
                    onValueChange={(value) => setNewSale({...newSale, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Adicionar Produto</Label>
                  <div className="text-xs text-gray-500">
                    {products.length} produtos disponíveis
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Popover open={isProductSearchOpen} onOpenChange={setIsProductSearchOpen}>
                      <PopoverTrigger asChild>
                        <div className="flex items-center border rounded-md px-3 py-2">
                          <Search className="h-4 w-4 text-gray-400 mr-2" />
                          <Input
                            placeholder="Pesquisar produto por nome ou código..."
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={productSearchTerm}
                            onChange={(e) => {
                              setProductSearchTerm(e.target.value);
                              handleSearchProduct();
                            }}
                            onFocus={() => setIsProductSearchOpen(true)}
                          />
                          {productSearchTerm && (
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setProductSearchTerm("");
                                setSearchedProducts([]);
                              }}
                            >
                              <X size={14} />
                            </button>
                          )}
                          <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        {searchedProducts.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            {productSearchTerm.length < 2 
                              ? "Digite pelo menos 2 caracteres para buscar" 
                              : "Nenhum produto encontrado"}
                          </div>
                        ) : (
                          <div className="max-h-[200px] overflow-auto">
                            {searchedProducts.map((product) => (
                              <button
                                key={product.id}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductSearchTerm(product.name);
                                  setIsProductSearchOpen(false);
                                }}
                              >
                                <span>{product.name}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <Button onClick={handleAddItemToSale} disabled={!selectedProduct}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-md">
                {newSale.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum item adicionado
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newSale.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRemoveItemFromSale(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {newSale.items.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <div className="space-x-2 flex items-center">
                      <Label htmlFor="discount">Desconto:</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-24"
                        value={newSale.discount}
                        onChange={(e) => handleApplyDiscount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="text-xl font-bold">
                      Total: R$ {newSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCompleteSale} disabled={newSale.items.length === 0}>
                Finalizar Venda
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {filteredSales.filter(sale => sale.status === "Concluída").length}
              </div>
              <ShoppingCart className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                R$ {getTotalFilteredAmount().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <CreditCard className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {filteredSales.filter(sale => sale.status === "Concluída").length > 0 
                  ? `R$ ${(getTotalFilteredAmount() / filteredSales.filter(sale => sale.status === "Concluída").length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : "R$ 0,00"}
              </div>
              <Receipt className="h-5 w-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-2 space-y-4">
          <div className="flex items-center border rounded-md px-3 py-2">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              placeholder="Buscar por cliente..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="Concluída">Concluída</SelectItem>
              <SelectItem value="Aguardando Pagamento">Aguardando Pagamento</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md p-4 space-y-4 bg-white">
        <div className="flex items-center gap-4">
          <div>
            <Label className="text-sm font-medium mb-1 block">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[240px] justify-start text-left font-normal ${
                    !dateRange.from && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({
                        from: range.from,
                        to: range.to || range.from,
                      });
                    }
                  }}
                  numberOfMonths={2}
                />
                <div className="p-3 border-t border-gray-100 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                  >
                    Limpar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Set today
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      setDateRange({ from: today, to: today });
                    }}
                  >
                    Hoje
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Pagamento</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.date.split('-').reverse().join('/')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {sale.customer}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      {sale.paymentMethod === "Dinheiro" && <Banknote size={14} />}
                      {sale.paymentMethod === "Cartão de Crédito" && <CreditCard size={14} />}
                      {sale.paymentMethod === "Cartão de Débito" && <CreditCard size={14} />}
                      {sale.paymentMethod === "Pix" && <CreditCard size={14} />}
                      <span>{sale.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs
                      ${sale.status === "Concluída" ? "bg-green-100 text-green-800" :
                        sale.status === "Aguardando Pagamento" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"}
                    `}>
                      {sale.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewSale(sale)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Printer className="mr-2 h-4 w-4" /> Imprimir
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

      {/* View sale dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda #{selectedSale?.id}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Data</p>
                  <p>{selectedSale.date.split('-').reverse().join('/')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className={`inline-flex mt-1 px-2 py-1 rounded-full text-xs
                    ${selectedSale.status === "Concluída" ? "bg-green-100 text-green-800" :
                      selectedSale.status === "Aguardando Pagamento" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"}
                  `}>
                    {selectedSale.status}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p>{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Forma de Pagamento</p>
                  <p>{selectedSale.paymentMethod}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Itens da Venda</p>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="pt-2 flex justify-between border-t">
                <p className="font-medium">Total</p>
                <p className="font-bold">
                  R$ {selectedSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
            <Button>
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
