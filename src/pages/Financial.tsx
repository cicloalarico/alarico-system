
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for financial charts
const revenueData = [
  { name: "Jan", value: 4000 },
  { name: "Fev", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Abr", value: 2780 },
  { name: "Mai", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
];

const expensesByCategory = [
  { name: "Estoque", value: 35 },
  { name: "Salários", value: 30 },
  { name: "Aluguel", value: 15 },
  { name: "Marketing", value: 10 },
  { name: "Outros", value: 10 },
];

// Mock transactions for the table
const recentTransactions = [
  { id: 1, date: "2024-04-01", description: "Venda de Bicicleta Mountain Bike", amount: 2500, type: "income" },
  { id: 2, date: "2024-04-02", description: "Pagamento de Fornecedor", amount: 1200, type: "expense" },
  { id: 3, date: "2024-04-03", description: "Serviço de Manutenção", amount: 150, type: "income" },
  { id: 4, date: "2024-04-04", description: "Compra de Peças", amount: 800, type: "expense" },
  { id: 5, date: "2024-04-05", description: "Venda de Acessórios", amount: 350, type: "income" },
];

const Financial = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  
  const handleAddTransaction = (type: string) => {
    toast({
      title: "Transação registrada",
      description: `A ${type === "income" ? "receita" : "despesa"} foi adicionada com sucesso.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-shop-primary">Gestão Financeira</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe e gerencie as finanças da sua empresa
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.345,67</div>
            <p className="text-xs text-muted-foreground">
              +5.2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lucro
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 32.886,22</div>
            <p className="text-xs text-muted-foreground">
              +25.8% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contas a Receber
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.450,00</div>
            <p className="text-xs text-muted-foreground">
              12 clientes com pagamentos pendentes
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Faturamento Mensal</CardTitle>
            <CardDescription>Análise de receitas e despesas mensais</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <BarChart
                data={revenueData}
                index="name"
                categories={["value"]}
                colors={["#f97316"]}
                valueFormatter={(value) => `R$ ${value}`}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
            <CardDescription>Por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart
                data={expensesByCategory}
                index="name"
                categories={["value"]}
                valueFormatter={(value) => `${value}%`}
                colors={["#f97316", "#94a3b8", "#64748b", "#475569", "#334155"]}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Management */}
      <div className="mt-6">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Transações Recentes</TabsTrigger>
            <TabsTrigger value="add-income">Adicionar Receita</TabsTrigger>
            <TabsTrigger value="add-expense">Adicionar Despesa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>Acompanhe suas receitas e despesas recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Descrição</th>
                        <th className="text-right py-3 px-4 font-medium">Valor</th>
                        <th className="text-right py-3 px-4 font-medium">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-2 px-4">{transaction.description}</td>
                          <td className={`py-2 px-4 text-right ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-destructive'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'} 
                            R$ {transaction.amount.toFixed(2)}
                          </td>
                          <td className="py-2 px-4 text-right">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'income' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Exportar</Button>
                <Button variant="outline">Ver Todos</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-income">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nova Receita</CardTitle>
                <CardDescription>Adicione uma nova entrada de receita</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income-date">Data</Label>
                    <Input 
                      id="income-date" 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income-category">Categoria</Label>
                    <Select>
                      <SelectTrigger id="income-category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Venda de Produto</SelectItem>
                        <SelectItem value="service">Serviço</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="income-description">Descrição</Label>
                  <Input id="income-description" placeholder="Descreva a receita" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income-amount">Valor (R$)</Label>
                    <Input id="income-amount" type="number" min="0" step="0.01" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income-payment-method">Método de Pagamento</Label>
                    <Select>
                      <SelectTrigger id="income-payment-method">
                        <SelectValue placeholder="Forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="credit">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit">Cartão de Débito</SelectItem>
                        <SelectItem value="transfer">Transferência</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleAddTransaction("income")}>
                  <Plus className="mr-2 h-4 w-4" /> Registrar Receita
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-expense">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nova Despesa</CardTitle>
                <CardDescription>Adicione uma nova entrada de despesa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Data</Label>
                    <Input 
                      id="expense-date" 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Categoria</Label>
                    <Select>
                      <SelectTrigger id="expense-category">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Estoque</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                        <SelectItem value="salary">Salários</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="utilities">Serviços Públicos</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-description">Descrição</Label>
                  <Input id="expense-description" placeholder="Descreva a despesa" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Valor (R$)</Label>
                    <Input id="expense-amount" type="number" min="0" step="0.01" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-payment-method">Método de Pagamento</Label>
                    <Select>
                      <SelectTrigger id="expense-payment-method">
                        <SelectValue placeholder="Forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="credit">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit">Cartão de Débito</SelectItem>
                        <SelectItem value="transfer">Transferência</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleAddTransaction("expense")}>
                  <Plus className="mr-2 h-4 w-4" /> Registrar Despesa
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Financial;
