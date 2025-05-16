
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types";
import SalesList from "@/components/sales/SalesList";
import SaleForm from "@/components/sales/SaleForm";
import SaleDetails from "@/components/sales/SaleDetails";
import { useSales } from "@/hooks/useSales";
import { useToast } from "@/hooks/use-toast";
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
  const { sales, createSale, updateSaleStatus, deleteSale } = useSales();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined);

  const handleAddSale = (sale: Omit<Sale, 'id'>) => {
    createSale(sale)
      .then(() => {
        setIsAddDialogOpen(false);
      })
      .catch(error => {
        console.error("Erro ao adicionar venda:", error);
      });
  };

  const handleEditSale = (sale: Sale) => {
    updateSaleStatus(sale.id, sale.status)
      .then(() => {
        setIsEditDialogOpen(false);
      })
      .catch(error => {
        console.error("Erro ao atualizar venda:", error);
      });
  };

  const handleDeleteSale = () => {
    if (selectedSale) {
      deleteSale(selectedSale.id)
        .then(() => {
          setIsDeleteDialogOpen(false);
        })
        .catch(error => {
          console.error("Erro ao excluir venda:", error);
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
