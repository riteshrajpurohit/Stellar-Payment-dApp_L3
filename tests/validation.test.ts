import { validateTransactionInput } from '../src/lib/validation/tx-validation';
import { describe, it, expect } from 'vitest';

describe('Transaction Validation', () => {
  const validKey = 'GDYO33EC5Z65IVO5DVKPM2TAVRA5OGICPI5WQ3TDB3DJM2ENNINXRAYC';

  it('rejects empty recipient', () => {
    expect(validateTransactionInput({ recipient: '', amount: '10' })).toBe('Recipient address is required.');
  });

  it('rejects invalid recipient format', () => {
    expect(validateTransactionInput({ recipient: 'InvalidKey', amount: '10' })).toContain('Invalid recipient address format');
  });

  it('rejects empty amount', () => {
    expect(validateTransactionInput({ recipient: validKey, amount: '' })).toBe('Amount is required.');
  });

  it('rejects negative or zero amount', () => {
    expect(validateTransactionInput({ recipient: validKey, amount: '-5' })).toBe('Amount must be a positive number.');
    expect(validateTransactionInput({ recipient: validKey, amount: '0' })).toBe('Amount must be a positive number.');
  });

  it('rejects more than 7 decimal places (Stellar Precision Limit)', () => {
    expect(validateTransactionInput({ recipient: validKey, amount: '10.12345678' })).toBe('Amount cannot have more than 7 decimal places.');
  });

  it('accepts valid inputs without returning an error message', () => {
    expect(validateTransactionInput({ recipient: validKey, amount: '10.5', memo: 'Hello' })).toBeNull();
  });

  it('rejects memo longer than 28 chars', () => {
    const longMemo = 'This is a very long memo that exceeds twenty eight characters';
    expect(validateTransactionInput({ recipient: validKey, amount: '10', memo: longMemo })).toBe('Memo is too long. Max 28 characters allowed.');
  });
});
