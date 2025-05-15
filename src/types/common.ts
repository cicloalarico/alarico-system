
export type PaymentMethodType = 'Dinheiro' | 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Crediário Loja' | 'Transferência' | 'Boleto';

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface PaymentInstallment {
  id: string;
  transactionId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: 'pago' | 'pendente' | 'atrasado' | 'cancelado';
  paymentDate?: string;
}
