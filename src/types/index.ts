export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  stock: number;
  status: 'Available' | 'Low Stock' | 'Expired';
  createdAt: string;
  updatedAt: string;
}

export interface DrugFormData {
  name: string;
  genericName: string;
  category: string;
  description: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  stock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartData {
  name: string;
  value: number;
}
