export interface OrderData {
  name: string;
  phone: string;
  address: string;
  scheduledAt: string;
  serviceId: string;
  notes?: string;
}

let orderData: OrderData | null = null;

export function setOrderData(data: OrderData) {
  orderData = data;
}

export function getOrderData(): OrderData | null {
  return orderData;
}

export function clearOrderData() {
  orderData = null;
}
