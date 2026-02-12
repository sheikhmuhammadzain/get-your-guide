import { connectToDatabase } from "@/lib/db/mongoose";
import { listAllItinerariesService } from "@/modules/itineraries/itinerary.service";
import { ItineraryModel } from "@/modules/itineraries/itinerary.model";
import { OrderModel } from "@/modules/orders/order.model";
import { listAllOrdersService } from "@/modules/orders/order.service";
import { listUsersService } from "@/modules/users/user.service";
import { countUsers } from "@/modules/users/user.repository";

export async function getAdminOverviewService() {
  await connectToDatabase();

  const [users, itineraries, orders, recentOrders, recentItineraries] = await Promise.all([
    countUsers(),
    ItineraryModel.countDocuments(),
    OrderModel.countDocuments(),
    OrderModel.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ItineraryModel.find({}).sort({ updatedAt: -1 }).limit(5).lean(),
  ]);

  const revenue = recentOrders.reduce((sum, item) => sum + (item.total ?? 0), 0);

  return {
    totals: {
      users,
      itineraries,
      orders,
      recentRevenue: revenue,
    },
    recentOrders: recentOrders.map((item) => ({
      id: item._id.toString(),
      orderCode: item.orderCode,
      total: item.total,
      currency: item.currency,
      customerEmail: item.customer.email,
      createdAt: item.createdAt,
    })),
    recentItineraries: recentItineraries.map((item) => ({
      id: item._id.toString(),
      status: item.status,
      updatedAt: item.updatedAt,
      userId: item.userId.toString(),
    })),
  };
}

export async function listAdminUsersService(cursor: string | undefined, limit: number) {
  return listUsersService(cursor, limit);
}

export async function listAdminOrdersService(cursor: string | undefined, limit: number) {
  return listAllOrdersService(cursor, limit);
}

export async function listAdminItinerariesService(cursor: string | undefined, limit: number) {
  return listAllItinerariesService(cursor, limit);
}
