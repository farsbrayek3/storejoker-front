"use client";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";

const fetchOrders = async () => {
  await new Promise((r) => setTimeout(r, 1200));
  return [
    {
      id: 1,
      card: "Visa 4111",
      buyer: "buyer",
      seller: "seller",
      price: 20,
      date: "2025-05-01",
      status: "completed",
    },
  ];
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return (
      <div>
        <Skeleton height={32} width={200} />
        <Skeleton height={40} count={3} className="mt-4" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Orders</h1>
      <table className="min-w-full bg-[#18141c] rounded-lg text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Card</th>
            <th className="py-2 px-4 text-left">Buyer</th>
            <th className="py-2 px-4 text-left">Seller</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o.id}>
              <td className="py-2 px-4">{o.card}</td>
              <td className="py-2 px-4">{o.buyer}</td>
              <td className="py-2 px-4">{o.seller}</td>
              <td className="py-2 px-4">${o.price}</td>
              <td className="py-2 px-4">
                {dayjs(o.date).format("MMM D, YYYY")}
              </td>
              <td className="py-2 px-4">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
