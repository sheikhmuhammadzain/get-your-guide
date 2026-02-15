import { connectToDatabase } from "@/lib/db/mongoose";
import { listFeedbackService } from "@/modules/feedback/feedback.service";
import { FeedbackModel } from "@/modules/feedback/feedback.model";
import { listAllItinerariesService } from "@/modules/itineraries/itinerary.service";
import { ItineraryModel } from "@/modules/itineraries/itinerary.model";
import { OrderModel } from "@/modules/orders/order.model";
import { listAllOrdersService } from "@/modules/orders/order.service";
import { listUsersService } from "@/modules/users/user.service";
import { countUsers } from "@/modules/users/user.repository";

export async function getAdminOverviewService() {
  await connectToDatabase();

  const [users, itineraries, orders, feedback, recentOrders, recentItineraries, recentFeedback] = await Promise.all([
    countUsers(),
    ItineraryModel.countDocuments(),
    OrderModel.countDocuments(),
    FeedbackModel.countDocuments(),
    OrderModel.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ItineraryModel.find({}).sort({ updatedAt: -1 }).limit(5).lean(),
    FeedbackModel.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const revenue = recentOrders.reduce((sum, item) => sum + (item.total ?? 0), 0);

  return {
    totals: {
      users,
      itineraries,
      orders,
      feedback,
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
    recentFeedback: recentFeedback.map((item) => ({
      id: item._id.toString(),
      category: item.category,
      rating: item.rating ?? null,
      email: item.email ?? null,
      createdAt: item.createdAt,
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

export async function listAdminFeedbackService(cursor: string | undefined, limit: number) {
  return listFeedbackService(cursor, limit);
}
