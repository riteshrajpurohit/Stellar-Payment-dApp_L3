import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TxResultCard } from '../src/components/app/tx-result-card';
import type { TransactionResult } from '../src/types/stellar';

describe('TxResultCard Component', () => {
  it('does not render when status is idle', () => {
    const { container } = render(<TxResultCard status="idle" error={null} result={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders pending status correctly', () => {
    render(<TxResultCard status="pending" error={null} result={null} />);
    expect(screen.getByText('Transaction Pending...')).toBeInTheDocument();
  });

  it('renders success status and results correctly', () => {
    const result: TransactionResult = { 
      hash: 'abcd1234efgh5678', 
      ledger: 100, 
      successful: true, 
      amount: '15', 
      recipient: 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35PSTXIX6TZF2N7AYY2NR62EUT', 
      createdAt: 'date',
      explorerUrl: 'https://testnet.stellarexpert.com/abcd1234efgh5678'
    };
    render(<TxResultCard status="success" error={null} result={result} />);
    expect(screen.getByText('Transaction Successful')).toBeInTheDocument();
    expect(screen.getByText('+15 XLM')).toBeInTheDocument();
    expect(screen.getByText('abcd1234efgh5678')).toBeInTheDocument();
  });

  it('renders error status correctly', () => {
    render(<TxResultCard status="error" error="Insufficient funds" result={null} />);
    expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
    expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
  });
});
