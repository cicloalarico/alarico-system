export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          color: string | null
          customer_id: number | null
          description: string | null
          end_time: string
          id: string
          service_order_id: string | null
          start: string
          status: Database["public"]["Enums"]["appointment_status"]
          technician_id: number | null
          title: string
        }
        Insert: {
          color?: string | null
          customer_id?: number | null
          description?: string | null
          end_time: string
          id: string
          service_order_id?: string | null
          start: string
          status?: Database["public"]["Enums"]["appointment_status"]
          technician_id?: number | null
          title: string
        }
        Update: {
          color?: string | null
          customer_id?: number | null
          description?: string | null
          end_time?: string
          id?: string
          service_order_id?: string | null
          start?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          technician_id?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["bill_category"]
          created_at: string | null
          description: string
          document: string | null
          due_date: string
          frequency: Database["public"]["Enums"]["bill_frequency"]
          id: string
          is_recurring: boolean
          notes: string | null
          parent_bill_id: string | null
          payment_date: string | null
          status: Database["public"]["Enums"]["bill_status"]
          supplier: string | null
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["bill_category"]
          created_at?: string | null
          description: string
          document?: string | null
          due_date: string
          frequency: Database["public"]["Enums"]["bill_frequency"]
          id: string
          is_recurring?: boolean
          notes?: string | null
          parent_bill_id?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["bill_status"]
          supplier?: string | null
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["bill_category"]
          created_at?: string | null
          description?: string
          document?: string | null
          due_date?: string
          frequency?: Database["public"]["Enums"]["bill_frequency"]
          id?: string
          is_recurring?: boolean
          notes?: string | null
          parent_bill_id?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["bill_status"]
          supplier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_parent_bill_id_fkey"
            columns: ["parent_bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          cpf: string
          created_at: string | null
          email: string
          id: number
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          cpf: string
          created_at?: string | null
          email: string
          id?: number
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          cpf?: string
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      employee_advances: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          description: string
          employee_id: number
          id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          description: string
          employee_id: number
          id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          description?: string
          employee_id?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_advances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_salaries: {
        Row: {
          base_salary: number
          bill_id: string
          commission: number | null
          created_at: string | null
          employee_id: number
          id: string
          month: number
          net_salary: number
          sales_target: number | null
          total_advances: number | null
          year: number
        }
        Insert: {
          base_salary: number
          bill_id: string
          commission?: number | null
          created_at?: string | null
          employee_id: number
          id: string
          month: number
          net_salary: number
          sales_target?: number | null
          total_advances?: number | null
          year: number
        }
        Update: {
          base_salary?: number
          bill_id?: string
          commission?: number | null
          created_at?: string | null
          employee_id?: number
          id?: string
          month?: number
          net_salary?: number
          sales_target?: number | null
          total_advances?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_salaries_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_salaries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string
          due_date: string | null
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          related_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description: string
          due_date?: string | null
          id: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          related_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          related_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      page_permissions: {
        Row: {
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: number
          page_name: string
          profile_id: number | null
        }
        Insert: {
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: number
          page_name: string
          profile_id?: number | null
        }
        Update: {
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: number
          page_name?: string
          profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_permissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_installments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          installment_number: number
          payment_date: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id: string
          installment_number: number
          payment_date?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          installment_number?: number
          payment_date?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_installments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          category: string
          code: string
          cost_price: number
          id: number
          last_updated: string | null
          location: string | null
          min_sell_price: number
          min_stock: number
          name: string
          profit_margin: number
          sell_price: number
          stock: number
          supplier: string | null
        }
        Insert: {
          brand: string
          category: string
          code: string
          cost_price: number
          id?: number
          last_updated?: string | null
          location?: string | null
          min_sell_price: number
          min_stock?: number
          name: string
          profit_margin: number
          sell_price: number
          stock?: number
          supplier?: string | null
        }
        Update: {
          brand?: string
          category?: string
          code?: string
          cost_price?: number
          id?: number
          last_updated?: string | null
          location?: string | null
          min_sell_price?: number
          min_stock?: number
          name?: string
          profit_margin?: number
          sell_price?: number
          stock?: number
          supplier?: string | null
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          id: number
          product_id: number
          quantity: number
          sale_id: string
          subtotal: number
          unit_price: number
        }
        Insert: {
          id?: number
          product_id: number
          quantity: number
          sale_id: string
          subtotal: number
          unit_price: number
        }
        Update: {
          id?: number
          product_id?: number
          quantity?: number
          sale_id?: string
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          customer_id: number | null
          date: string
          id: string
          invoice_number: string | null
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["sale_status"]
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          customer_id?: number | null
          date?: string
          id: string
          invoice_number?: string | null
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["sale_status"]
          total_amount: number
        }
        Update: {
          created_at?: string | null
          customer_id?: number | null
          date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["sale_status"]
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_items: {
        Row: {
          id: number
          name: string
          price: number
          service_order_id: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          service_order_id: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          service_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_items_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          bike_model: string
          completed_at: string | null
          created_at: string | null
          customer_id: number
          down_payment: number | null
          first_installment_date: string | null
          id: string
          installment_amount: number | null
          installments: number | null
          issue_description: string
          labor_value: number | null
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          priority: Database["public"]["Enums"]["service_priority"]
          scheduled_for: string
          status: Database["public"]["Enums"]["service_status"]
          technician_id: number | null
          total_price: number
        }
        Insert: {
          bike_model: string
          completed_at?: string | null
          created_at?: string | null
          customer_id: number
          down_payment?: number | null
          first_installment_date?: string | null
          id: string
          installment_amount?: number | null
          installments?: number | null
          issue_description: string
          labor_value?: number | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          priority?: Database["public"]["Enums"]["service_priority"]
          scheduled_for: string
          status?: Database["public"]["Enums"]["service_status"]
          technician_id?: number | null
          total_price?: number
        }
        Update: {
          bike_model?: string
          completed_at?: string | null
          created_at?: string | null
          customer_id?: number
          down_payment?: number | null
          first_installment_date?: string | null
          id?: string
          installment_amount?: number | null
          installments?: number | null
          issue_description?: string
          labor_value?: number | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          priority?: Database["public"]["Enums"]["service_priority"]
          scheduled_for?: string
          status?: Database["public"]["Enums"]["service_status"]
          technician_id?: number | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_product_items: {
        Row: {
          id: number
          price: number
          product_id: number
          quantity: number
          service_order_id: string
          subtotal: number
        }
        Insert: {
          id?: number
          price: number
          product_id: number
          quantity: number
          service_order_id: string
          subtotal: number
        }
        Update: {
          id?: number
          price?: number
          product_id?: number
          quantity?: number
          service_order_id?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_product_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_product_items_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          price: number
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          price?: number
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string | null
          date: string
          document: string | null
          id: number
          product_id: number
          quantity: number
          reason: string
          time: string
          type: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          date: string
          document?: string | null
          id?: number
          product_id: number
          quantity: number
          reason: string
          time: string
          type: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          date?: string
          document?: string | null
          id?: number
          product_id?: number
          quantity?: number
          reason?: string
          time?: string
          type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: number
          is_active: boolean
          last_login: string | null
          name: string
          password: string
          profile_id: number | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id?: number
          is_active?: boolean
          last_login?: string | null
          name: string
          password: string
          profile_id?: number | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: number
          is_active?: boolean
          last_login?: string | null
          name?: string
          password?: string
          profile_id?: number | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: { product_id: number; amount: number }
        Returns: number
      }
      generate_appointment_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_bill_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_financial_transaction_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_sale_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_service_order_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_stock: {
        Args: { product_id: number; amount: number }
        Returns: number
      }
    }
    Enums: {
      appointment_status:
        | "Agendado"
        | "Confirmado"
        | "Em andamento"
        | "Concluído"
        | "Cancelado"
      bill_category:
        | "fornecedor"
        | "utilidades"
        | "funcionário"
        | "aluguel"
        | "impostos"
        | "marketing"
        | "outros"
      bill_frequency: "único" | "mensal" | "trimestral" | "semestral" | "anual"
      bill_status: "pendente" | "pago" | "atrasado" | "cancelado"
      payment_method:
        | "Dinheiro"
        | "PIX"
        | "Cartão de Crédito"
        | "Cartão de Débito"
        | "Crediário Loja"
        | "Transferência"
        | "Boleto"
      sale_status: "Concluída" | "Cancelada" | "Pendente"
      service_priority: "Baixa" | "Normal" | "Alta" | "Urgente"
      service_status:
        | "Aberta"
        | "Em andamento"
        | "Aguardando peças"
        | "Concluída"
        | "Entregue"
        | "Cancelada"
        | "Aguardando"
      transaction_status: "pago" | "pendente" | "cancelado" | "atrasado"
      transaction_type: "receita" | "despesa"
      user_role: "admin" | "tech" | "seller" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "Agendado",
        "Confirmado",
        "Em andamento",
        "Concluído",
        "Cancelado",
      ],
      bill_category: [
        "fornecedor",
        "utilidades",
        "funcionário",
        "aluguel",
        "impostos",
        "marketing",
        "outros",
      ],
      bill_frequency: ["único", "mensal", "trimestral", "semestral", "anual"],
      bill_status: ["pendente", "pago", "atrasado", "cancelado"],
      payment_method: [
        "Dinheiro",
        "PIX",
        "Cartão de Crédito",
        "Cartão de Débito",
        "Crediário Loja",
        "Transferência",
        "Boleto",
      ],
      sale_status: ["Concluída", "Cancelada", "Pendente"],
      service_priority: ["Baixa", "Normal", "Alta", "Urgente"],
      service_status: [
        "Aberta",
        "Em andamento",
        "Aguardando peças",
        "Concluída",
        "Entregue",
        "Cancelada",
        "Aguardando",
      ],
      transaction_status: ["pago", "pendente", "cancelado", "atrasado"],
      transaction_type: ["receita", "despesa"],
      user_role: ["admin", "tech", "seller", "user"],
    },
  },
} as const
