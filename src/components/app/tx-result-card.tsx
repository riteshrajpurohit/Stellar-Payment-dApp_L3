import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import type { TransactionResult, TxStatus } from "@/types/stellar";

interface TxResultCardProps {
  status: TxStatus;
  error: string | null;
  result: TransactionResult | null;
}

export function TxResultCard({ status, error, result }: TxResultCardProps) {
  if (status === "idle") return null;

  return (
    <div className={`glass-card p-6 border ${
      status === "success" ? "border-emerald-500/30 bg-emerald-500/5" :
      status === "error" ? "border-red-500/30 bg-red-500/5" :
      "border-blue-500/30 bg-blue-500/5"
    }`}>
      
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {status === "pending" && <Clock className="animate-spin text-blue-400" size={24} />}
          {status === "success" && <CheckCircle2 className="text-emerald-400" size={24} />}
          {status === "error" && <XCircle className="text-red-400" size={24} />}
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-medium text-white">
            {status === "pending" && "Transaction Pending..."}
            {status === "success" && "Transaction Successful"}
            {status === "error" && "Transaction Failed"}
          </h3>
          
          <p className="text-sm text-slate-400">
            {status === "pending" && "Please wait while the transaction is being submitted to the network."}
            {status === "success" && "Your payment has been successfully added to the ledger."}
            {status === "error" && (error || "An unknown error occurred.")}
          </p>

          {result && status === "success" && (
            <div className="mt-4 rounded-lg bg-black/40 p-4 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500">Amount</span>
                 <span className="font-medium text-emerald-400">+{result.amount || "0"} XLM</span>
              </div>
              <div className="flex justify-between items-center text-xs break-all gap-4">
                 <span className="text-slate-500 whitespace-nowrap">Hash</span>
                 <span className="font-mono text-slate-300 ml-auto text-right">{result.hash}</span>
              </div>
              {result.explorerUrl && (
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2 mt-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  View on Explorer <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
