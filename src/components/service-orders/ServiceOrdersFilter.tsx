
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ServiceOrdersFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ServiceOrdersFilter: React.FC<ServiceOrdersFilterProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
}) => {
  return (
    <>
      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Buscar por número, cliente ou bicicleta..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {/* Content will be provided by ServiceOrdersList */}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4 mt-4">
          {/* Content will be provided by ServiceOrdersList */}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4 mt-4">
          {/* Content will be provided by ServiceOrdersList */}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ServiceOrdersFilter;
