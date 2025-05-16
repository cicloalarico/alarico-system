
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PagePermission, availablePages } from "@/types";
import { useUserProfiles } from "@/hooks/useUserProfiles";

interface PermissionsFormProps {
  profileId: number;
  onSave: () => void;
}

const PermissionsForm: React.FC<PermissionsFormProps> = ({ profileId, onSave }) => {
  const { fetchProfilePermissions, saveProfilePermissions } = useUserProfiles();
  const [permissions, setPermissions] = useState<Partial<PagePermission>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileId) {
      loadPermissions();
    } else {
      initializeEmptyPermissions();
    }
  }, [profileId]);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const fetchedPermissions = await fetchProfilePermissions(profileId);
      
      // Se não existirem permissões para alguma página, cria-se com valores padrão
      const allPermissions = [...availablePages].map(page => {
        const existingPermission = fetchedPermissions.find(p => p.pageName === page.id);
        if (existingPermission) {
          return existingPermission;
        } else {
          return {
            profileId,
            pageName: page.id,
            canView: true,
            canEdit: false
          };
        }
      });
      
      setPermissions(allPermissions);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeEmptyPermissions = () => {
    const emptyPermissions = [...availablePages].map(page => ({
      profileId,
      pageName: page.id,
      canView: true,
      canEdit: false
    }));
    setPermissions(emptyPermissions);
  };

  const handlePermissionChange = (pageId: string, field: "canView" | "canEdit", value: boolean) => {
    setPermissions(prev => prev.map(permission => {
      if (permission.pageName === pageId) {
        return {
          ...permission,
          [field]: value,
          // Se canView for falso, canEdit também deve ser falso
          ...(field === "canView" && !value ? { canEdit: false } : {})
        };
      }
      return permission;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveProfilePermissions(profileId, permissions);
      onSave();
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {availablePages.map((page) => {
          const permission = permissions.find(p => p.pageName === page.id);
          
          return (
            <Card key={page.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{page.name}</div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`${page.id}-view`}
                        checked={permission?.canView || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(page.id, "canView", checked === true)
                        }
                      />
                      <Label htmlFor={`${page.id}-view`}>Visualizar</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`${page.id}-edit`}
                        checked={permission?.canEdit || false}
                        disabled={!permission?.canView}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(page.id, "canEdit", checked === true)
                        }
                      />
                      <Label htmlFor={`${page.id}-edit`}>Editar</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Permissões"}
        </Button>
      </div>
    </form>
  );
};

export default PermissionsForm;
