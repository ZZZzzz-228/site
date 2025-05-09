import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Полный тип сервиса — с id, name и т.д.
interface Service {
  id: number;
  type: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
}

interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
}

const ServiceBookingDialog: React.FC<ServiceBookingDialogProps> = ({
  open,
  onOpenChange,
  selectedService
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md neo-card border-white/10">
        <DialogHeader>
          <DialogTitle className="gradient-text">
            {selectedService ? `Запись в ${selectedService.name}` : 'Запись'}
          </DialogTitle>
          <DialogDescription>
            Заполните форму для записи на обслуживание
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">ФИО</Label>
            <Input id="name" placeholder="Иван Иванов" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" type="tel" placeholder="+7 (___) ___-__-__" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="car">Марка и модель автомобиля</Label>
            <Input id="car" placeholder="Toyota Camry" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Услуга</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oil">Замена масла</SelectItem>
                <SelectItem value="diag">Диагностика</SelectItem>
                <SelectItem value="repair">Ремонт</SelectItem>
                <SelectItem value="wash">Мойка</SelectItem>
                <SelectItem value="fuel">Заправка</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Дата и время</Label>
            <Input id="date" type="datetime-local" />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Записаться
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingDialog;
