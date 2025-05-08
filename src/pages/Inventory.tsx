
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, AlertTriangle, ArrowUpDown, Package } from "lucide-react";

// Mock inventory data
const initialInventory = [
  {
    id: 1,
    productCode: "BIC001",
    productName: "Bicicleta Mountain Bike 29\"",
    category: "Bicicletas",
    quantity: 5,
    minQuantity: 2,
    location: "Prateleira A1",
    lastUpdated: "2024-05-02",
    status: "Em estoque",
  },
  {
    id: 2,
    productCode: "PEC001",
    productName: "Pedal Plataforma Alumínio",
    category: "Componentes",
    quantity: 15,
    minQuantity: 5,
    location: "Gaveta B3",
    lastUpdated: "2024-05-01",
    status: "Em estoque",
  },
  {
    id: 3,
    productCode: "PNEU001",
    productName: "Pneu MTB 29\" x 2.20",
    category: "Pneus",
    quantity: 8,
    minQuantity: 10,
    location: "Prateleira C2",
    lastUpdated: "2024-04-28",
    status: "Baixo estoque",
  },
  {
    id: 4,
    productCode: "CAP001",
    productName: "Capacete MTB Ventilado",
    category: "Acessórios",
    quantity: 12,
    minQuantity: 5,
    location: "Expositor D1",
    lastUpdated: "2024-04-30",
    status: "Em estoque",
  },
  {
    id: 5,
    productCode: "LUB001",
    productName: "Lubrificante para Corrente 100ml",
    category: "Lubrificantes",
    quantity: 3,
    minQuantity: 15,
    location: "Prateleira E4",
    lastUpdated: "2024-04-25",
    status: "Baixo estoque",
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

const locations = [
  "Prateleira A1",
  "Prateleira A2",
  "Prateleira B1",
  "Prateleira B2",
  "Gaveta B3",
  "Prateleira C1",
  "Prateleira C2",
  "Expositor D1",
  "Prateleira E4",
];

const Inventory = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustType, setAdjustType] = useState("add");
  
  const [newItem, setNewItem] = useState({
    productCode: "",
    productName: "",
    category: "",
    quantity: 0,
    minQuantity: 0,
    location: "",
  });

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = () => {
    if (!newItem.productCode || !newItem.productName || !newItem.category) {
      toast({
        title: "Erro ao adicionar item",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const id = inventory.length > 0 ? Math.max(...inventory.map(p => p.id)) + 1 : 1;
    const currentDate = new Date().toISOString().split('T')[0];
    
    const status = newItem.quantity < newItem.minQuantity ? "Baixo estoque" : "Em estoque";
    
    setInventory([
      ...inventory, 
      { 
        id, 
        ...newItem, 
        lastUpdated: currentDate,
        status
      }
    ]);
    
    setNewItem({
      productCode: "",
      productName: "",
      category: "",
      quantity: 0,
      minQuantity: 0,
      location: "",
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Item adicionado",
      description: `${newItem.productName} foi adicionado ao estoque.`,
    });
  };

  const handleAdjustStock = () => {
    if (!selectedItem || adjustQuantity <= 0) {
      toast({
        title: "Erro ao ajustar estoque",
        description: "Quantidade inválida.",
        variant: "destructive",
      });
      return;
    }

    const updatedInventory = inventory.map(item => {
      if (item.id === selectedItem.id) {
        let newQuantity = item.quantity;
        
        if (adjustType === "add") {
          newQuantity += adjustQuantity;
        } else if (adjustType === "remove") {
          newQuantity = Math.max(0, item.quantity - adjustQuantity);
        } else if (adjustType === "set") {
          newQuantity = adjustQuantity;
        }
        
        const status = newQuantity < item.minQuantity ? "Baixo estoque" : "Em estoque";
        const currentDate = new Date().toISOString().split('T')[0];
        
        return {
          ...item,
          quantity: newQuantity,
          status,
          lastUpdated: currentDate,
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setIsAdjustDialogOpen(false);
    setAdjustQuantity(0);
    setAdjustType("add");
    
    toast({
      title: "Estoque ajustado",
      description: `Estoque de ${selectedItem.productName} foi atualizado.`,
    });
  };

  const openAdjustDialog = (item: any) => {
    setSelectedItem(item);
    setIsAdjustDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ 
      ...newItem, 
      [name]: name === "quantity" || name === "minQuantity"
        ? parseInt(value) || 0
        : value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} /> Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Item ao Estoque</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productCode">Código *</Label>
                  <Input
                    id="productCode"
                    name="productCode"
                    value={newItem.productCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="productName">Nome do Produto *</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={newItem.productName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={newItem.category} 
                    onValueChange={(value) => setNewItem({...newItem, category: value})}
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
                  <Label htmlFor="location">Localização</Label>
                  <Select 
                    value={newItem.location} 
                    onValueChange={(value) => setNewItem({...newItem, location: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade Inicial</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Estoque Mínimo</Label>
                  <Input
                    id="minQuantity"
                    name="minQuantity"
                    type="number"
                    min="0"
                    value={newItem.minQuantity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddItem}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center border rounded-md px-3 py-2 flex-1">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            placeholder="Buscar por nome ou código..."
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
        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              <SelectItem value="Em estoque">Em estoque</SelectItem>
              <SelectItem value="Baixo estoque">Baixo estoque</SelectItem>
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
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="hidden md:table-cell">Localização</TableHead>
              <TableHead className="hidden lg:table-cell">Última Atualização</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Ajustar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  Nenhum item encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productCode}</TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{item.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <span className={`font-medium ${
                        item.quantity < item.minQuantity ? "text-red-500" : "text-green-600"
                      }`}>
                        {item.status}
                      </span>
                      {item.quantity < item.minQuantity && (
                        <AlertTriangle size={16} className="ml-2 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => openAdjustDialog(item)}
                    >
                      <ArrowUpDown size={14} />
                      <span className="hidden md:inline">Ajustar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Adjust stock dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Estoque</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedItem.productName}</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  Estoque atual: {selectedItem.quantity}
                </span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adjustType">Tipo de Ajuste</Label>
                <Select value={adjustType} onValueChange={setAdjustType}>
                  <SelectTrigger id="adjustType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Adicionar</SelectItem>
                    <SelectItem value="remove">Remover</SelectItem>
                    <SelectItem value="set">Definir quantidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adjustQuantity">Quantidade</Label>
                <Input
                  id="adjustQuantity"
                  type="number"
                  min="0"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="rounded-md bg-blue-50 p-3 text-sm">
                {adjustType === "add" && (
                  <p>Novo estoque: {selectedItem.quantity + adjustQuantity}</p>
                )}
                {adjustType === "remove" && (
                  <p>Novo estoque: {Math.max(0, selectedItem.quantity - adjustQuantity)}</p>
                )}
                {adjustType === "set" && (
                  <p>Novo estoque: {adjustQuantity}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjustStock}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
