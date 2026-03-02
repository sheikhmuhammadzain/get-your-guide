import { getOptionsByProductId } from "./product-option.repository";

export interface AvailableOption {
  id: string;
  name: string;
  description: string;
  openingHoursText: string;
  pricePerPerson: number;
  currency: string;
  cancellationHours: number;
  maxGroupSize: number;
  timeSlots: string[];
  /** Formatted cancellation deadline for the given date */
  cancellationDeadline: string;
}

/**
 * Returns options available for productId on the given date.
 * @param date  ISO date string "YYYY-MM-DD"
 * @param travelers  number of travelers (used to filter out maxGroupSize)
 */
export async function getAvailabilityService(
  productId: string,
  date: string,
  travelers: number,
): Promise<AvailableOption[]> {
  const all = await getOptionsByProductId(productId);
  if (all.length === 0) return [];

  const dayOfWeek = new Date(date).getDay(); // 0=Sun … 6=Sat

  const available = all.filter((opt) => {
    const days = opt.availableDaysOfWeek as number[];
    const fits = travelers <= (opt.maxGroupSize as number);
    const open = days.length === 0 || days.includes(dayOfWeek);
    return fits && open;
  });

  return available.map((opt) => {
    // Build cancellation deadline string: date at activity start minus cancellationHours
    const [firstSlot] = (opt.timeSlots as string[]);
    const [slotH, slotM] = (firstSlot ?? "09:00").split(":").map(Number);
    const activityStart = new Date(`${date}T${String(slotH).padStart(2, "0")}:${String(slotM ?? 0).padStart(2, "0")}:00`);
    const deadline = new Date(activityStart.getTime() - (opt.cancellationHours as number) * 60 * 60 * 1000);
    const deadlineStr = deadline.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      id: opt._id.toString(),
      name: opt.name as string,
      description: opt.description as string,
      openingHoursText: opt.openingHoursText as string,
      pricePerPerson: opt.pricePerPerson as number,
      currency: opt.currency as string,
      cancellationHours: opt.cancellationHours as number,
      maxGroupSize: opt.maxGroupSize as number,
      timeSlots: opt.timeSlots as string[],
      cancellationDeadline: deadlineStr,
    };
  });
}
