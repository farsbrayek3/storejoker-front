"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";

const schema = z.object({
  cardNumber: z.string().min(8, "Card number required"),
  expiration: z.string().min(4, "Expiration required"),
  cvv: z.string().min(3, "CVV required"),
  price: z.coerce.number().min(1, "Price required"),
});

type CardInput = z.infer<typeof schema>;

const addCard = async (data: CardInput) => {
  await new Promise((r) => setTimeout(r, 800));
  return data;
};

export default function AddCardPage() {
  const user = useUserStore((s) => s.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CardInput>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: addCard,
    onSuccess: () => {
      toast.success("Card added!");
      reset();
    },
  });

  if (!user?.roles.includes("seller")) return <div>Unauthorized</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Add Card</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-3 max-w-md"
      >
        <input
          {...register("cardNumber")}
          placeholder="Card Number"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        {errors.cardNumber && (
          <span className="text-red-400">{errors.cardNumber.message}</span>
        )}
        <input
          {...register("expiration")}
          placeholder="Expiration (MM/YY)"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        {errors.expiration && (
          <span className="text-red-400">{errors.expiration.message}</span>
        )}
        <input
          {...register("cvv")}
          placeholder="CVV"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        {errors.cvv && (
          <span className="text-red-400">{errors.cvv.message}</span>
        )}
        <input
          type="number"
          {...register("price")}
          placeholder="Price"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        {errors.price && (
          <span className="text-red-400">{errors.price.message}</span>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
        >
          {mutation.isPending ? "Adding..." : "Add Card"}
        </button>
      </form>
    </div>
  );
}
