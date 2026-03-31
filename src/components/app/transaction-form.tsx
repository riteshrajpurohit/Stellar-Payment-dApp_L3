"use client";

import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface TransactionFormProps {
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: (data: {
    recipient: string;
    amount: string;
    memo?: string;
  }) => void;
}

export function TransactionForm({
  disabled,
  isSubmitting,
  onSubmit,
}: TransactionFormProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ recipient, amount, memo });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-medium text-white">
            <Send className="text-emerald-400" /> Send Payment
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recipient Address (Public Key)
            </label>
            <input
              type="text"
              placeholder="G..."
              disabled={disabled || isSubmitting}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all font-mono"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Amount (XLM)
              </label>
              <input
                type="number"
                step="0.0000001"
                min="0"
                placeholder="0.00"
                disabled={disabled || isSubmitting}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all font-mono"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Memo (Optional)
              </label>
              <input
                type="text"
                maxLength={28}
                placeholder="Text memo"
                disabled={disabled || isSubmitting}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || isSubmitting || !recipient || !amount}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 border border-emerald-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all"
      >
        {isSubmitting ? (
          <>
            <Spinner className="text-white" /> Sending...
          </>
        ) : (
          <>
            Confirm Transaction <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
