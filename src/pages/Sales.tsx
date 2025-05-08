
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { salesData } from "@/data/salesData";
import { Sale } from "@/types";
import { toast } from "@/hooks/use-toast";
import SalesList from "@/components/sales/SalesList";
import SaleForm from "@/components/sales/SaleForm";
import SaleDetails from "@/components/sales/SaleDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(salesData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);

  const handleAddSale = (sale: Sale) => {
    setSales([sale, ...sales]);
    setIsAddDialogOpen(false);
    toast({
      title: "Venda cadastrada com sucesso",
      description: `A venda ${sale.id} foi adicionada com sucesso.`,
    });
  };

  const handleEditSale = (sale: Sale) => {
    setSales(sales.map((s) => (s.id === sale.id ? sale : s)));
    setIsEditDialogOpen(false);
    toast({
      title: "Venda atualizada com sucesso",
      description: `A venda ${sale.id} foi atualizada com sucesso.`,
    });
  };

  const handleDeleteSale = () => {
    if (selectedSale) {
      setSales(sales.filter((s) => s.id !== selectedSale.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Venda excluída com sucesso",
        description: `A venda ${selectedSale.id} foi excluída com sucesso.`,
      });
    }
  };

  const handleViewSale = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    setSelectedSale(sale);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    setSelectedSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    setSelectedSale(sale);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-gray-500">Gerencie as vendas da loja</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      <SalesList
        sales={sales}
        onView={handleViewSale}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <SaleForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddSale}
      />

      <SaleForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditSale}
        initialData={selectedSale}
      />

      <SaleDetails
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        sale={selectedSale}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a venda {selectedSale?.id}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSale}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sales;
