"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import clsx from "clsx";

// Single card schema
const singleSchema = z.object({
  cardNumber: z.string().min(8, "Card number required"),
  expiration: z.string().min(4, "Expiration required"),
  cvv: z.string().min(3, "CVV required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
});
type SingleCardInput = z.infer<typeof singleSchema>;

// Mass card schema
const massSchema = z.object({
  massText: z.string().min(1, "Paste at least one card"),
});
type MassCardInput = z.infer<typeof massSchema>;

// Simulate adding card(s)
const addCard = async (data: SingleCardInput) => {
  await new Promise((r) => setTimeout(r, 700));
  return data;
};
const addCards = async (cards: SingleCardInput[]) => {
  await new Promise((r) => setTimeout(r, 1200));
  return cards;
};

// Parse pasted lines to cards array
function parseMassList(text: string): SingleCardInput[] {
  // Accept: cardNumber|expiration|cvv|price or CSV with , or | as separator, one card per line
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[|,]/).map((p) => p.trim());
      // Support price optional (set to 1 if missing)
      return {
        cardNumber: parts[0] || "",
        expiration: parts[1] || "",
        cvv: parts[2] || "",
        price: Number(parts[3]) || 1,
      };
    })
    .filter(
      (card) =>
        card.cardNumber.length >= 8 &&
        card.expiration.length >= 4 &&
        card.cvv.length >= 3
    );
}

export default function AddCardPage() {
  const [tab, setTab] = useState<"single" | "mass">("single");

  // Single card form
  const {
    register: singleRegister,
    handleSubmit: singleHandleSubmit,
    formState: { errors: singleErrors },
    reset: singleReset,
  } = useForm<SingleCardInput>({ resolver: zodResolver(singleSchema) });
  const singleMutation = useMutation({
    mutationFn: addCard,
    onSuccess: () => {
      toast.success("Card added!");
      singleReset();
    },
  });

  // Mass card form
  const {
    register: massRegister,
    handleSubmit: massHandleSubmit,
    formState: { errors: massErrors },
    reset: massReset,
    watch: massWatch,
    setValue: setMassValue,
  } = useForm<MassCardInput>({ resolver: zodResolver(massSchema) });
  const [parsedMassCards, setParsedMassCards] = useState<SingleCardInput[]>([]);
  const massTextValue = massWatch("massText") ?? "";

  // Parse on textarea change
  function onMassTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMassValue("massText", e.target.value);
    setParsedMassCards(parseMassList(e.target.value));
  }

  const massMutation = useMutation({
    mutationFn: () => addCards(parsedMassCards),
    onSuccess: (added) => {
      toast.success(`${added.length} cards added!`);
      massReset();
      setParsedMassCards([]);
    },
    onError: () => toast.error("Please check your mass input formatting."),
  });

  // Rules to display above inputs
  const rules = [
    "Card number: min 8 digits",
    "Expiration: format MM/YY or MM/YYYY",
    "CVV: min 3 digits",
    "Price: number, must be at least 1",
  ];
  const massRules = [
    "Paste one card per line, use | or , as separator.",
    "Format: cardNumber|expiration|cvv|price (price required).",
    "Example: 4111111111111111|12/26|123|100",
    "All fields required, price must be at least 1.",
  ];

  return (
    <div>
      <h1 className="text-2xl mb-6 font-bold text-[#38E54D]">Add Card</h1>
      {/* Tabs */}
      <div className="flex border-b border-[#27212c] mb-6 gap-4">
        <button
          className={clsx(
            "py-2 px-4 font-semibold transition rounded-t",
            tab === "single"
              ? "border-b-2 border-[#38E54D] text-[#38E54D] bg-[#191a1d]"
              : "text-[#aaa] hover:text-[#38E54D]"
          )}
          onClick={() => setTab("single")}
        >
          Add Single Card
        </button>
        <button
          className={clsx(
            "py-2 px-4 font-semibold transition rounded-t",
            tab === "mass"
              ? "border-b-2 border-[#38E54D] text-[#38E54D] bg-[#191a1d]"
              : "text-[#aaa] hover:text-[#38E54D]"
          )}
          onClick={() => setTab("mass")}
        >
          Mass Add Cards
        </button>
      </div>

      {/* Single Card */}
      {tab === "single" && (
        <form
          onSubmit={singleHandleSubmit((data) => singleMutation.mutate(data))}
          className="space-y-5 max-w-md bg-[#18141c] p-6 rounded-lg shadow border border-[#27212c]"
        >
          <ul className="mb-2 text-xs text-[#bbb] list-disc list-inside space-y-0.5">
            {rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <div>
            <label className="block text-[#aaa] mb-1">Card Number</label>
            <input
              {...singleRegister("cardNumber")}
              placeholder="Card Number"
              className={clsx(
                "w-full rounded p-2 bg-[#111] text-white border",
                singleErrors.cardNumber ? "border-red-400" : "border-[#333]"
              )}
              autoComplete="cc-number"
            />
            {singleErrors.cardNumber && (
              <span className="text-red-400 text-xs">
                {singleErrors.cardNumber.message}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[#aaa] mb-1">Expiration</label>
              <input
                {...singleRegister("expiration")}
                placeholder="MM/YY"
                className={clsx(
                  "w-full rounded p-2 bg-[#111] text-white border",
                  singleErrors.expiration ? "border-red-400" : "border-[#333]"
                )}
                autoComplete="cc-exp"
              />
              {singleErrors.expiration && (
                <span className="text-red-400 text-xs">
                  {singleErrors.expiration.message}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-[#aaa] mb-1">CVV</label>
              <input
                {...singleRegister("cvv")}
                placeholder="CVV"
                className={clsx(
                  "w-full rounded p-2 bg-[#111] text-white border",
                  singleErrors.cvv ? "border-red-400" : "border-[#333]"
                )}
                autoComplete="cc-csc"
              />
              {singleErrors.cvv && (
                <span className="text-red-400 text-xs">
                  {singleErrors.cvv.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[#aaa] mb-1">Price</label>
            <input
              type="number"
              min={1}
              {...singleRegister("price")}
              placeholder="Price"
              className={clsx(
                "w-full rounded p-2 bg-[#111] text-white border",
                singleErrors.price ? "border-red-400" : "border-[#333]"
              )}
            />
            {singleErrors.price && (
              <span className="text-red-400 text-xs">
                {singleErrors.price.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={singleMutation.isPending}
            className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold w-full mt-2 transition hover:bg-[#2fd44d]"
          >
            {singleMutation.isPending ? "Adding..." : "Add Card"}
          </button>
        </form>
      )}

      {/* Mass Add */}
      {tab === "mass" && (
        <form
          onSubmit={massHandleSubmit(() => massMutation.mutate())}
          className="space-y-5 max-w-2xl bg-[#18141c] p-6 rounded-lg shadow border border-[#27212c]"
        >
          <ul className="mb-2 text-xs text-[#bbb] list-disc list-inside space-y-0.5">
            {massRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <label className="block text-[#aaa] mb-1 font-semibold">
            Mass Add List
          </label>
          <textarea
            {...massRegister("massText")}
            value={massTextValue}
            onChange={onMassTextChange}
            rows={6}
            className={clsx(
              "w-full rounded p-2 bg-[#111] text-white border font-mono text-sm",
              massErrors.massText ? "border-red-400" : "border-[#333]"
            )}
            placeholder={`4111111111111111|12/26|123|100\n5555555555554444|11/25|321|80`}
          />
          {massErrors.massText && (
            <span className="text-red-400 text-xs">
              {massErrors.massText.message}
            </span>
          )}
          {massTextValue && (
            <div className="my-2">
              <div className="text-xs text-[#38E54D] font-medium mb-1">
                Parsed Cards: {parsedMassCards.length}
              </div>
              <div className="overflow-x-auto rounded border border-[#222]">
                <table className="min-w-full text-xs text-white">
                  <thead className="bg-[#23232a]">
                    <tr>
                      <th className="px-3 py-2 text-left">Card Number</th>
                      <th className="px-3 py-2 text-left">Expiration</th>
                      <th className="px-3 py-2 text-left">CVV</th>
                      <th className="px-3 py-2 text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedMassCards.map((c, idx) => (
                      <tr
                        key={idx}
                        className={clsx(
                          "border-t border-[#23232a]",
                          c.cardNumber.length < 8 ||
                            c.expiration.length < 4 ||
                            c.cvv.length < 3 ||
                            Number.isNaN(c.price) ||
                            c.price < 1
                            ? "bg-[#2f171a]"
                            : ""
                        )}
                      >
                        <td className="px-3 py-1 font-mono">{c.cardNumber}</td>
                        <td className="px-3 py-1 font-mono">{c.expiration}</td>
                        <td className="px-3 py-1 font-mono">{c.cvv}</td>
                        <td className="px-3 py-1 font-mono">{c.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-[#bbb] mt-1">
                Invalid or incomplete rows will be ignored.
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={!parsedMassCards.length || massMutation.isPending}
            className={clsx(
              "bg-[#38E54D] text-[#18141c] px-6 py-2 rounded font-bold w-full mt-2 transition hover:bg-[#2fd44d]",
              (!parsedMassCards.length || massMutation.isPending) &&
                "opacity-60"
            )}
          >
            {massMutation.isPending
              ? "Adding..."
              : `Add ${parsedMassCards.length || ""} Card${
                  parsedMassCards.length === 1 ? "" : "s"
                }`}
          </button>
        </form>
      )}
    </div>
  );
}
