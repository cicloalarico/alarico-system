
import React, { useState, useEffect } from "react";
import { format, isAfter, parseISO } from "date-fns";
import { Plus, FileText, Receipt, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Bill, EmployeeSalary } from "@/types";
import { billsData, employeeSalariesData } from "@/data/billsData";
import { toast } from "@/hooks/use-toast";

import BillsList from "@/components/bills/BillsList";
import BillForm from "@/components/bills/BillForm";
import EmployeeSalaryForm from "@/components/bills/EmployeeSalaryForm";
import BillDetails from "@/components/bills/BillDetails";

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

const Bills: React.FC = () => {
  // Estados para armazenar as contas a pagar e salários de funcionários
  const [bills, setBills] = useState<Bill[]>(billsData);
  const [employeeSalaries, setEmployeeSalaries] = useState<EmployeeSalary[]>(employeeSalariesData);
  
  // Estados para os modais
  const [isAddBillDialogOpen, setIsAddBillDialogOpen] = useState(false);
  const [isAddEmployeeSalaryDialogOpen, setIsAddEmployeeSalaryDialogOpen] = useState(false);
  const [isEditBillDialogOpen, setIsEditBillDialogOpen] = useState(false);
  const [isEditEmployeeSalaryDialogOpen, setIsEditEmployeeSalaryDialogOpen] = useState(false);
  const [isBillDetailsDialogOpen, setIsBillDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateConfirmDialogOpen, setIsDuplicateConfirmDialogOpen] = useState(false);
  
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState("todos");
  
  // Estados para armazenar o item selecionado
  const [selectedBill, setSelectedBill] = useState<Bill | undefined>(undefined);
  const [selectedEmployeeSalary, setSelectedEmployeeSalary] = useState<EmployeeSalary | undefined>(undefined);
  
  // Combinação de contas regulares e salários
  const allBills = [...bills, ...employeeSalaries];
  
  // Efeito para verificar contas vencidas e não pagas
  useEffect(() => {
    // Verifica e atualiza contas atrasadas
    const today = new Date();
    
    // Atualiza o status de contas regulares vencidas
    const updatedBills = bills.map(bill => {
      if (bill.status === "pendente" && isAfter(today, parseISO(bill.dueDate))) {
        return { ...bill, status: "atrasado" };
      }
      return bill;
    });
    
    // Atualiza o status de salários vencidos
    const updatedSalaries = employeeSalaries.map(salary => {
      if (salary.status === "pendente" && isAfter(today, parseISO(salary.dueDate))) {
        return { ...salary, status: "atrasado" };
      }
      return salary;
    });
    
    // Atualiza os estados se houver mudanças
    if (JSON.stringify(updatedBills) !== JSON.stringify(bills)) {
      setBills(updatedBills);
    }
    
    if (JSON.stringify(updatedSalaries) !== JSON.stringify(employeeSalaries)) {
      setEmployeeSalaries(updatedSalaries);
    }
  }, [bills, employeeSalaries]);
  
  // Cálculo de totais
  const calculateTotals = () => {
    const totals = {
      pendentes: 0,
      atrasados: 0,
      pagos: 0,
      totalGeral: 0,
      funcionarios: 0,
      fornecedores: 0,
      utilidades: 0,
    };
    
    allBills.forEach(bill => {
      // Totais por status
      if (bill.status === "pendente") {
        totals.pendentes += bill.amount;
      } else if (bill.status === "atrasado") {
        totals.atrasados += bill.amount;
      } else if (bill.status === "pago") {
        totals.pagos += bill.amount;
      }
      
      // Total geral
      totals.totalGeral += bill.amount;
      
      // Totais por categoria
      if (bill.category === "funcionário") {
        totals.funcionarios += bill.amount;
      } else if (bill.category === "fornecedor") {
        totals.fornecedores += bill.amount;
      } else if (bill.category === "utilidades") {
        totals.utilidades += bill.amount;
      }
    });
    
    return totals;
  };
  
  // Filtrar contas com base na aba selecionada
  const getFilteredBills = () => {
    switch (activeTab) {
      case "pendentes":
        return allBills.filter(bill => bill.status === "pendente");
      case "atrasados":
        return allBills.filter(bill => bill.status === "atrasado");
      case "pagos":
        return allBills.filter(bill => bill.status === "pago");
      case "funcionarios":
        return allBills.filter(bill => bill.category === "funcionário");
      case "fornecedores":
        return allBills.filter(bill => bill.category === "fornecedor");
      default:
        return allBills;
    }
  };
  
  // Formatador de números para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  // Manipuladores para conta regular
  const handleAddBill = (newBill: Bill) => {
    setBills([newBill, ...bills]);
    setIsAddBillDialogOpen(false);
    toast({
      title: "Conta cadastrada com sucesso",
      description: `A conta ${newBill.description} foi adicionada.`,
    });
  };
  
  const handleEditBill = (updatedBill: Bill) => {
    if ("employeeName" in updatedBill) {
      // É um salário de funcionário
      setEmployeeSalaries(
        employeeSalaries.map(salary => 
          salary.id === updatedBill.id ? updatedBill as EmployeeSalary : salary
        )
      );
    } else {
      // É uma conta regular
      setBills(
        bills.map(bill => bill.id === updatedBill.id ? updatedBill : bill)
      );
    }
    
    setIsEditBillDialogOpen(false);
    setIsEditEmployeeSalaryDialogOpen(false);
    
    toast({
      title: "Conta atualizada com sucesso",
      description: `A conta ${updatedBill.description} foi atualizada.`,
    });
  };
  
  const handleDeleteBill = () => {
    if (!selectedBill) return;
    
    if ("employeeName" in selectedBill) {
      // É um salário de funcionário
      setEmployeeSalaries(
        employeeSalaries.filter(salary => salary.id !== selectedBill.id)
      );
    } else {
      // É uma conta regular
      setBills(
        bills.filter(bill => bill.id !== selectedBill.id)
      );
    }
    
    setIsDeleteDialogOpen(false);
    toast({
      title: "Conta excluída com sucesso",
      description: `A conta ${selectedBill.description} foi excluída.`,
    });
  };
  
  const handlePayBill = (id: string) => {
    // Verifica se é um salário ou conta regular
    const employeeSalary = employeeSalaries.find(salary => salary.id === id);
    
    if (employeeSalary) {
      // Atualizar salário
      const updatedSalary: EmployeeSalary = {
        ...employeeSalary,
        status: "pago",
        paymentDate: format(new Date(), "yyyy-MM-dd"),
      };
      
      setEmployeeSalaries(
        employeeSalaries.map(salary => salary.id === id ? updatedSalary : salary)
      );
      
      toast({
        title: "Pagamento registrado",
        description: `O pagamento de ${employeeSalary.description} foi registrado com sucesso.`,
      });
    } else {
      // Atualizar conta regular
      const bill = bills.find(bill => bill.id === id);
      
      if (bill) {
        const updatedBill: Bill = {
          ...bill,
          status: "pago",
          paymentDate: format(new Date(), "yyyy-MM-dd"),
        };
        
        setBills(
          bills.map(bill => bill.id === id ? updatedBill : bill)
        );
        
        toast({
          title: "Pagamento registrado",
          description: `O pagamento de ${bill.description} foi registrado com sucesso.`,
        });
      }
    }
  };
  
  // Manipulador para adicionar salário de funcionário
  const handleAddEmployeeSalary = (newSalary: EmployeeSalary) => {
    setEmployeeSalaries([newSalary, ...employeeSalaries]);
    setIsAddEmployeeSalaryDialogOpen(false);
    toast({
      title: "Salário cadastrado com sucesso",
      description: `O registro de salário para ${newSalary.employeeName} foi adicionado.`,
    });
  };
  
  // Manipulador para ver detalhes
  const handleViewBill = (id: string) => {
    const foundBill = allBills.find(bill => bill.id === id);
    if (foundBill) {
      setSelectedBill(foundBill);
      setIsBillDetailsDialogOpen(true);
    }
  };
  
  // Manipulador para editar
  const handleEditClick = (id: string) => {
    const employeeSalary = employeeSalaries.find(salary => salary.id === id);
    
    if (employeeSalary) {
      // É um salário de funcionário
      setSelectedEmployeeSalary(employeeSalary);
      setIsEditEmployeeSalaryDialogOpen(true);
    } else {
      // É uma conta regular
      const bill = bills.find(bill => bill.id === id);
      if (bill) {
        setSelectedBill(bill);
        setIsEditBillDialogOpen(true);
      }
    }
  };
  
  // Manipulador para excluir
  const handleDeleteClick = (id: string) => {
    const foundBill = allBills.find(bill => bill.id === id);
    if (foundBill) {
      setSelectedBill(foundBill);
      setIsDeleteDialogOpen(true);
    }
  };
  
  // Manipulador para duplicar conta
  const handleDuplicateClick = (id: string) => {
    const foundBill = allBills.find(bill => bill.id === id);
    if (foundBill) {
      setSelectedBill(foundBill);
      setIsDuplicateConfirmDialogOpen(true);
    }
  };
  
  // Manipulador para confirmar duplicação de conta
  const handleConfirmDuplicate = () => {
    if (!selectedBill) return;
    
    if ("employeeName" in selectedBill) {
      // Duplicar salário de funcionário
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const newEmployeeSalary: EmployeeSalary = {
        ...selectedBill,
        id: `SAL${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        description: `${selectedBill.description.split('-')[0].trim()} - ${format(nextMonth, 'MMMM/yyyy', { locale: ptBR })}`,
        status: "pendente",
        dueDate: format(nextMonth, 'yyyy-MM-dd'),
        paymentDate: undefined,
        parentBillId: selectedBill.id,
      };
      
      setEmployeeSalaries([newEmployeeSalary, ...employeeSalaries]);
    } else {
      // Duplicar conta regular
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const newBill: Bill = {
        ...selectedBill,
        id: `B${new Date().getFullYear()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: "pendente",
        dueDate: format(nextMonth, 'yyyy-MM-dd'),
        paymentDate: undefined,
        parentBillId: selectedBill.id,
      };
      
      setBills([newBill, ...bills]);
    }
    
    setIsDuplicateConfirmDialogOpen(false);
    toast({
      title: "Conta duplicada com sucesso",
      description: `Uma nova cópia da conta ${selectedBill.description} foi criada.`,
    });
  };
  
  const totals = calculateTotals();
  const filteredBills = getFilteredBills();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contas a Pagar</h1>
          <p className="text-gray-500">Gerencie as despesas e obrigações financeiras</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddBillDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
          <Button onClick={() => setIsAddEmployeeSalaryDialogOpen(true)} variant="outline">
            <User className="mr-2 h-4 w-4" />
            Novo Salário
          </Button>
        </div>
      </div>

      {/* Cards com os resumos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Contas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">
                {formatCurrency(totals.pendentes)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Contas Atrasadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(totals.atrasados)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Contas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totals.pagos)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {formatCurrency(totals.totalGeral)}
            </span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Detalhamento das contas por categoria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <User className="mr-2 h-4 w-4 text-blue-600" />
            <h3 className="font-medium">Funcionários</h3>
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(totals.funcionarios)}</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <Receipt className="mr-2 h-4 w-4 text-purple-600" />
            <h3 className="font-medium">Fornecedores</h3>
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(totals.fornecedores)}</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <FileText className="mr-2 h-4 w-4 text-orange-600" />
            <h3 className="font-medium">Utilidades</h3>
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(totals.utilidades)}</p>
        </div>
      </div>
      
      <Separator />

      {/* Lista de contas com filtro por abas */}
      <div className="space-y-4">
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="todos">Todas</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="atrasados">Atrasadas</TabsTrigger>
              <TabsTrigger value="pagos">Pagas</TabsTrigger>
              <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
              <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            <BillsList
              bills={filteredBills}
              onViewBill={handleViewBill}
              onEditBill={handleEditClick}
              onDeleteBill={handleDeleteClick}
              onDuplicateBill={handleDuplicateClick}
              onPayBill={handlePayBill}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Adicionar Nova Conta */}
      <BillForm
        isOpen={isAddBillDialogOpen}
        onClose={() => setIsAddBillDialogOpen(false)}
        onSave={handleAddBill}
      />

      {/* Modal de Adicionar Novo Salário */}
      <EmployeeSalaryForm
        isOpen={isAddEmployeeSalaryDialogOpen}
        onClose={() => setIsAddEmployeeSalaryDialogOpen(false)}
        onSave={handleAddEmployeeSalary}
      />

      {/* Modal de Editar Conta */}
      <BillForm
        isOpen={isEditBillDialogOpen}
        onClose={() => setIsEditBillDialogOpen(false)}
        onSave={handleEditBill}
        initialData={selectedBill}
      />
      
      {/* Modal de Editar Salário */}
      <EmployeeSalaryForm
        isOpen={isEditEmployeeSalaryDialogOpen}
        onClose={() => setIsEditEmployeeSalaryDialogOpen(false)}
        onSave={handleEditBill}
        initialData={selectedEmployeeSalary}
      />
      
      {/* Modal de Detalhes da Conta */}
      <BillDetails
        isOpen={isBillDetailsDialogOpen}
        onClose={() => setIsBillDetailsDialogOpen(false)}
        bill={selectedBill as Bill | EmployeeSalary}
      />

      {/* Confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta "{selectedBill?.description}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBill}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirmação de duplicação */}
      <AlertDialog open={isDuplicateConfirmDialogOpen} onOpenChange={setIsDuplicateConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicar conta</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja criar uma nova conta com base em "{selectedBill?.description}"?
              Uma cópia será criada para o próximo período.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDuplicate}>
              Duplicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Bills;
