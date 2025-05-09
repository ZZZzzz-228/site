
import { UtilityOutage, District } from "../types/utility";

// Текущая дата
const now = new Date();

// Служебная функция для создания даты относительно текущей
function createDate(hours: number): Date {
  const date = new Date(now);
  date.setHours(date.getHours() + hours);
  return date;
}

// Моковые данные отключений
export const mockOutages: UtilityOutage[] = [
  {
    id: "1",
    type: "water",
    status: "active",
    startTime: createDate(-2),
    endTime: createDate(4),
    address: "ул. Ленина 45-67, Центральный район",
    district: "Центральный",
    description: "Аварийное отключение холодной воды из-за прорыва трубы",
    affectedHouses: 12,
    source: "КрасКом",
    coordinates: [56.010563, 92.852572],
  },
  {
    id: "2",
    type: "electricity",
    status: "scheduled",
    startTime: createDate(12),
    endTime: createDate(20),
    address: "ул. Молокова 1-40, Советский район",
    district: "Советский",
    description: "Плановые работы по замене электрооборудования",
    affectedHouses: 8,
    source: "МРСК Сибири",
    coordinates: [56.046596, 92.901855],
  },
  {
    id: "3",
    type: "heating",
    status: "active",
    startTime: createDate(-5),
    endTime: createDate(3),
    address: "ул. Железнодорожников 10-32, Железнодорожный район",
    district: "Железнодорожный",
    description: "Снижение параметров отопления из-за ремонта на ТЭЦ",
    affectedHouses: 24,
    source: "СГК",
    coordinates: [56.012569, 92.875684],
  },
  {
    id: "4",
    type: "gas",
    status: "resolved",
    startTime: createDate(-24),
    endTime: createDate(-12),
    address: "ул. 9 Мая 20-46, Советский район",
    district: "Советский",
    description: "Профилактические работы на газопроводе",
    affectedHouses: 5,
    source: "Красноярскгоргаз",
    coordinates: [56.053790, 92.929106],
  },
  {
    id: "5",
    type: "internet",
    status: "active",
    startTime: createDate(-1),
    endTime: createDate(6),
    address: "пр. Свободный 50-76, Октябрьский район",
    district: "Октябрьский",
    description: "Повреждение оптического кабеля при строительных работах",
    affectedHouses: 14,
    source: "Ростелеком",
    coordinates: [56.024585, 92.797852],
  },
  {
    id: "6",
    type: "water",
    status: "scheduled",
    startTime: createDate(48),
    endTime: createDate(72),
    address: "ул. Весны 1-33, Советский район",
    district: "Советский",
    description: "Плановые работы по промывке водопровода",
    affectedHouses: 18,
    source: "КрасКом",
    coordinates: [56.057252, 92.908335],
  },
  {
    id: "7",
    type: "electricity",
    status: "active",
    startTime: createDate(-6),
    endTime: createDate(2),
    address: "ул. Партизана Железняка 1-50, Советский район",
    district: "Советский",
    description: "Аварийное отключение из-за повреждений на подстанции",
    affectedHouses: 30,
    source: "МРСК Сибири",
    coordinates: [56.040864, 92.891870],
  },
  {
    id: "8",
    type: "heating",
    status: "scheduled",
    startTime: createDate(24),
    endTime: createDate(48),
    address: "ул. Мира 1-50, Центральный район",
    district: "Центральный",
    description: "Плановая замена участка теплотрассы",
    affectedHouses: 22,
    source: "СГК",
    coordinates: [56.015790, 92.892514],
  }
];

// Районы Красноярска
export const districts: District[] = [
  { id: "1", name: "Центральный", active: true },
  { id: "2", name: "Советский", active: true },
  { id: "3", name: "Ленинский", active: true },
  { id: "4", name: "Кировский", active: true },
  { id: "5", name: "Свердловский", active: true },
  { id: "6", name: "Октябрьский", active: true },
  { id: "7", name: "Железнодорожный", active: true },
];

export const utilityTypeLabels: Record<string, string> = {
  water: "Водоснабжение",
  electricity: "Электроснабжение",
  heating: "Отопление",
  gas: "Газоснабжение",
  internet: "Интернет"
};

export const utilityTypeIcons: Record<string, string> = {
  water: "💧",
  electricity: "⚡",
  heating: "🔥",
  gas: "🔵",
  internet: "📶"
};
