import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Search, Plus } from "lucide-react";
import SuppliersList from "@/components/suppliers/SuppliersList";
import SupplierForm from "@/components/suppliers/SupplierForm";
import SupplierDetails from "@/components/suppliers/SupplierDetails";
import { Supplier } from "@/types";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Skeleton } from "@/components/ui/skeleton";

const Suppliers = () => {
  const { toast } = useToast();
  const { suppliers, loading, createSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Partial<Supplier>>({});
  const [deleteSupplierId, setDeleteSupplierId] = useState<number | null>(null);
  
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.cnpj && supplier.cnpj.includes(searchTerm))
  );

  const handleFieldChange = (field: string, value: any) => {
    setSelectedSupplier({ ...selectedSupplier, [field]: value });
  };

  const validateForm = () => {
    if (!selectedSupplier.name || !selectedSupplier.email || !selectedSupplier.cnpj) {
      toast({
        title: "Erro ao adicionar fornecedor",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddSupplier = async () => {
    if (!validateForm()) return;

    try {
      await createSupplier({
        name: selectedSupplier.name!,
        email: selectedSupplier.email!,
        phone: selectedSupplier.phone || "",
        cnpj: selectedSupplier.cnpj!,
        address: selectedSupplier.address || "",
        notes: selectedSupplier.notes || "",
      });
      
      setIsAddDialogOpen(false);
      setSelectedSupplier({});
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier.id || !validateForm()) return;

    try {
      await updateSupplier(selectedSupplier.id, {
        name: selectedSupplier.name!,
        email: selectedSupplier.email!,
        phone: selectedSupplier.phone || "",
        cnpj: selectedSupplier.cnpj!,
        address: selectedSupplier.address || "",
        notes: selectedSupplier.notes || "",
      });
      
      setIsEditDialogOpen(false);
      setSelectedSupplier({});
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!deleteSupplierId) return;

    try {
      await deleteSupplier(deleteSupplierId);
      setIsDeleteDialogOpen(false);
      setDeleteSupplierId(null);
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
    }
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (supplierId: number) => {
    setDeleteSupplierId(supplierId);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <Button onClick={() => {
          setSelectedSupplier({});
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Fornecedor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome, e-mail ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <SuppliersList
        suppliers={filteredSuppliers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialog de Adicionar */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Fornecedor</DialogTitle>
          </DialogHeader>
          <SupplierForm
            supplier={selectedSupplier}
            onChange={handleFieldChange}
            onSubmit={handleAddSupplier}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
          </DialogHeader>
          <SupplierForm
            supplier={selectedSupplier}
            onChange={handleFieldChange}
            onSubmit={handleEditSupplier}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Fornecedor</DialogTitle>
          </DialogHeader>
          {selectedSupplier.id && (
            <SupplierDetails supplier={selectedSupplier as Supplier} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmar Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSupplier} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Suppliers;
