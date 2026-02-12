import {
  createOrder,
  getOrderByCode,
  listAllOrders,
  listUserOrders,
  type CreateOrderInput,
} from "@/modules/orders/order.repository";

function mapOrder(doc: {
  _id: { toString(): string };
  userId?: { toString(): string } | null;
  customer: { fullName: string; email: string; phone: string; country: string };
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    currency: string;
    lineTotal: number;
  }>;
  total: number;
  currency: string;
  status: string;
  orderCode: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : null,
    customer: doc.customer,
    items: doc.items,
    total: doc.total,
    currency: doc.currency,
    status: doc.status,
    orderCode: doc.orderCode,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createOrderService(input: CreateOrderInput) {
  const doc = await createOrder(input);
  return mapOrder(doc);
}

export async function listUserOrdersService(userId: string, cursor: string | undefined, limit: number) {
  const page = await listUserOrders(userId, cursor, limit);
  return {
    data: page.data.map((doc) => mapOrder(doc)),
    nextCursor: page.nextCursor,
  };
}

export async function listAllOrdersService(cursor: string | undefined, limit: number) {
  const page = await listAllOrders(cursor, limit);
  return {
    data: page.data.map((doc) => mapOrder(doc)),
    nextCursor: page.nextCursor,
  };
}

export async function getOrderByCodeService(orderCode: string) {
  const doc = await getOrderByCode(orderCode);
  return mapOrder(doc);
}
