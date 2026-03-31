import { hasEnoughSpendableBalance } from '../src/lib/stellar';
import { describe, it, expect } from 'vitest';

describe('Stellar Core Utils - hasEnoughSpendableBalance', () => {
  it('returns false if balance is NaN', () => {
    expect(hasEnoughSpendableBalance('NaN', '10')).toBe(false);
  });

  it('returns false if amount is NaN', () => {
    expect(hasEnoughSpendableBalance('100', 'NaN')).toBe(false);
  });

  it('returns true if spendable is greater than amount + base fee', () => {
    // base fee is 1 XLM. 
    // balance: 10, amount: 5 -> spendable is 10 > 5 + 1 (true)
    expect(hasEnoughSpendableBalance('10', '5')).toBe(true);
  });

  it('returns true if spendable is exactly equal to amount + 0.00001 base fee', () => {
    // 10 > 9 + 0.00001 (9.00001) is true
    expect(hasEnoughSpendableBalance('10', '9')).toBe(true);
  });

  it('returns false if spendable is less than amount + base fee', () => {
    expect(hasEnoughSpendableBalance('10', '9.999999')).toBe(false);
  });
});
