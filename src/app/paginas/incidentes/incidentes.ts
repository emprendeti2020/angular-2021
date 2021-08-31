export interface Ticket {
  id: number;
  creator: string;
  title: string;
  assignee: string;
  status: string;
  labelbg: string;
  product: string;
  date: string;
}

export interface Incidente {
  id: number;
  creador: string,
  vivienda: string;
  tipo: string;
  detalle: string;
  fingreso: string;
  estado: string;
  prioridad: string;
}