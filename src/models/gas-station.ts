export interface GasStation {
  id: number;
  ownerId: number | null;

  name: string;
  position: Vector3Mp;

  onSale: boolean;
  originalPrice: number;
  onSalePrice: number;

  gasCount: number;
  gasPrice: number;

  gasCanisterCount: number;
  gasCanisterPrice: number;

  repairKitCount: number;
  repairKitPrice: number;

  electricityPrice: number;
}