import { StrKey } from "@stellar/stellar-sdk";

export interface TransactionValidationInput {
  recipient: string;
  amount: string;
  memo?: string;
}

export function validateTransactionInput({
  recipient,
  amount,
  memo,
}: TransactionValidationInput): string | null {
  if (!recipient || !recipient.trim()) {
    return "Recipient address is required.";
  }

  if (!StrKey.isValidEd25519PublicKey(recipient.trim())) {
    return "Invalid recipient address format. Must be a valid Stellar public key beginning with 'G'.";
  }

  if (!amount || !amount.trim()) {
    return "Amount is required.";
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return "Amount must be a positive number.";
  }

  // Regex to ensure no more than 7 decimal places for Stellar XLM limits.
  const decimalMatches = amount.match(/\.(\d+)/);
  if (decimalMatches && decimalMatches[1].length > 7) {
    return "Amount cannot have more than 7 decimal places.";
  }

  if (memo && memo.length > 28) {
    return "Memo is too long. Max 28 characters allowed.";
  }

  return null;
}
