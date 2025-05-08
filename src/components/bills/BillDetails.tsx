
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bill, EmployeeSalary } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getBillStatusBadgeVariant } from "@/data/billsData";
import { Printer } from "lucide-react";

interface BillDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | EmployeeSalary | null;
}

const BillDetails: React.FC<BillDetailsProps> = ({
  isOpen,
  onClose,
  bill,
}) => {
  if (!bill) return null;
  
  // Verifica se é um salário de funcionário
  const isEmployeeSalary = "employeeName" in bill;
  
  // Formatador de datas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Formatador de números para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  // Manipulador de impressão
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <div className="flex justify-between items-center">
            <DialogTitle>Detalhes da Conta</DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{bill.description}</h3>
              <p className="text-sm text-muted-foreground">ID: {bill.id}</p>
            </div>
            <Badge variant={getBillStatusBadgeVariant(bill.status)} className="capitalize">
              {bill.status}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categoria</p>
              <p className="capitalize">{bill.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor</p>
              <p className="font-semibold">{formatCurrency(bill.amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vencimento</p>
              <p>{formatDate(bill.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pagamento</p>
              <p>{bill.paymentDate ? formatDate(bill.paymentDate) : "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Frequência</p>
              <p className="capitalize">{bill.frequency}</p>
            </div>
            {bill.supplier && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fornecedor</p>
                <p>{bill.supplier}</p>
              </div>
            )}
            {bill.document && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documento</p>
                <p>{bill.document}</p>
              </div>
            )}
          </div>
          
          {isEmployeeSalary && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-semibold">Detalhes do Salário</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Funcionário</p>
                    <p>{(bill as EmployeeSalary).employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Salário Base</p>
                    <p>{formatCurrency((bill as EmployeeSalary).baseSalary)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Comissão</p>
                    <p>{formatCurrency((bill as EmployeeSalary).commission)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meta de Vendas</p>
                    <p>{formatCurrency((bill as EmployeeSalary).salesTarget)}</p>
                  </div>
                </div>
                
                <h4 className="font-semibold">Adiantamentos</h4>
                
                {(bill as EmployeeSalary).advances?.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-3 gap-2 p-3 bg-muted text-xs font-medium text-muted-foreground">
                      <div>Data</div>
                      <div>Valor</div>
                      <div>Descrição</div>
                    </div>
                    {(bill as EmployeeSalary).advances.map((advance, index) => (
                      <div key={advance.id} className={`grid grid-cols-3 gap-2 p-3 text-sm ${index % 2 !== 0 ? 'bg-muted/40' : ''}`}>
                        <div>{formatDate(advance.date)}</div>
                        <div>{formatCurrency(advance.amount)}</div>
                        <div>{advance.description}</div>
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-muted text-sm font-medium border-t">
                      <div>Total</div>
                      <div>{formatCurrency((bill as EmployeeSalary).totalAdvances)}</div>
                      <div></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum adiantamento registrado.</p>
                )}
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="font-medium">Salário Bruto:</p>
                    <p className="text-right">{formatCurrency((bill as EmployeeSalary).amount)}</p>
                    <p className="font-medium">Total Adiantamentos:</p>
                    <p className="text-right text-red-500">{formatCurrency((bill as EmployeeSalary).totalAdvances)}</p>
                    <Separator className="col-span-2 my-1" />
                    <p className="font-medium">Salário Líquido:</p>
                    <p className="text-right font-semibold">{formatCurrency((bill as EmployeeSalary).netSalary)}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {bill.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Observações</h4>
                <p className="text-sm whitespace-pre-line">{bill.notes}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillDetails;
