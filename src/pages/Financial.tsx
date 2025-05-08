
import React, { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { financialTransactionsData, cashFlowData } from "@/data/financialData";
import { FinancialTransaction } from "@/types";
import { toast } from "@/hooks/use-toast";

import TransactionsList from "@/components/financial/TransactionsList";
import TransactionForm from "@/components/financial/TransactionForm";
import CashFlowChart from "@/components/financial/CashFlowChart";

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

const Financial: React.FC = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(
    financialTransactionsData
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    FinancialTransaction | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState("todos");

  const calculateTotals = () => {
    const totals = {
      receitas: 0,
      despesas: 0,
      pendentes: 0,
      saldo: 0,
    };

    transactions.forEach((transaction) => {
      if (transaction.status === "pago") {
        if (transaction.type === "receita") {
          totals.receitas += transaction.amount;
          totals.saldo += transaction.amount;
        } else {
          totals.despesas += transaction.amount;
          totals.saldo -= transaction.amount;
        }
      } else if (transaction.status === "pendente" && transaction.type === "despesa") {
        totals.pendentes += transaction.amount;
      }
    });

    return totals;
  };

  const handleAddTransaction = (transaction: FinancialTransaction) => {
    setTransactions([transaction, ...transactions]);
    setIsAddDialogOpen(false);
    toast({
      title: "Transação cadastrada com sucesso",
      description: `A transação ${transaction.id} foi adicionada com sucesso.`,
    });
  };

  const handleEditTransaction = (transaction: FinancialTransaction) => {
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Transação atualizada com sucesso",
      description: `A transação ${transaction.id} foi atualizada com sucesso.`,
    });
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction) {
      setTransactions(
        transactions.filter((t) => t.id !== selectedTransaction.id)
      );
      setIsDeleteDialogOpen(false);
      toast({
        title: "Transação excluída com sucesso",
        description: `A transação ${selectedTransaction.id} foi excluída com sucesso.`,
      });
    }
  };

  const handleEditClick = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  // Filtra transações com base na aba selecionada
  const getFilteredTransactions = () => {
    switch (activeTab) {
      case "receitas":
        return transactions.filter((t) => t.type === "receita");
      case "despesas":
        return transactions.filter((t) => t.type === "despesa");
      case "pendentes":
        return transactions.filter(
          (t) => t.status === "pendente" && t.type === "despesa"
        );
      default:
        return transactions;
    }
  };

  const totals = calculateTotals();
  const filteredTransactions = getFilteredTransactions();

  // Formatação de números para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-gray-500">Controle financeiro da empresa</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards com os resumos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUpRight className="mr-2 h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totals.receitas)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowDownLeft className="mr-2 h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(totals.despesas)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Despesas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-amber-600">
              {formatCurrency(totals.pendentes)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`text-2xl font-bold ${
                totals.saldo >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(totals.saldo)}
            </span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Gráfico de Fluxo de Caixa */}
      <CashFlowChart data={cashFlowData} />

      <Separator />

      {/* Lista de transações com filtro por abas */}
      <div className="space-y-4">
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
              <TabsTrigger value="despesas">Despesas</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            <TransactionsList
              transactions={filteredTransactions}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TransactionForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddTransaction}
      />

      <TransactionForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditTransaction}
        initialData={selectedTransaction}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transação{" "}
              {selectedTransaction?.id}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Financial;
