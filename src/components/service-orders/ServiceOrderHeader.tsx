
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ServiceOrderHeaderProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (value: boolean) => void;
}

const ServiceOrderHeader: React.FC<ServiceOrderHeaderProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-1">
            <Plus size={16} /> Nova OS
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default ServiceOrderHeader;
