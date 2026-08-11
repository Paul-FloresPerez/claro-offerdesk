"use client";

import { useCallback, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import SaleForm from "@/components/sales/SaleForm";
import type {
  AdvisorOption,
  EditableSaleRow,
} from "@/components/sales/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateSaleDialog({
  advisors,
  defaultSaleDate,
}: {
  advisors: AdvisorOption[];
  defaultSaleDate: string;
}) {
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus data-icon="inline-start" />
        Registrar venta
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border border-white/10 bg-[#0B1120] text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Registrar venta
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              La sede se obtiene del asesor seleccionado y queda guardada como
              dato histórico.
            </DialogDescription>
          </DialogHeader>
          <SaleForm
            advisors={advisors}
            defaultSaleDate={defaultSaleDate}
            onSuccess={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EditSaleDialog({
  advisors,
  sale,
}: {
  advisors: AdvisorOption[];
  sale: EditableSaleRow;
}) {
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);
  const branchAdvisors = advisors.filter(
    (advisor) => advisor.branchId === sale.branchId
  );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Pencil data-icon="inline-start" />
        Editar
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border border-white/10 bg-[#0B1120] text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Corregir venta
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Puedes actualizar datos comerciales y estado. La sede y el usuario
              registrador no se pueden cambiar.
            </DialogDescription>
          </DialogHeader>
          <SaleForm
            advisors={branchAdvisors}
            defaultSaleDate={sale.saleDate}
            onSuccess={closeDialog}
            sale={sale}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
