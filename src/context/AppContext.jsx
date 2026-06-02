import React from 'react';
import normalizeTransaction, { normalizeTransactions } from '../lib/transactionNormalizer';

export const DataContext = React.createContext();
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

function readLocalStorageJSON(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return fallback;

    return JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}
export function AppContext({ children }) {
  const [transactions, setTransactions] = React.useState(() =>
    readLocalStorageJSON('transactions', [])
  );

  const [currency, setCurrency] = React.useState(() =>
    readLocalStorageJSON('currency', CURRENCIES[0])
  );

  const [converting, setConverting] = React.useState(false);
  const [currencySymbols, setCurrencySymbols] = React.useState({});

  React.useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        const symbols = {};

        Object.keys(data.rates).forEach((code) => {
          try {
            const formatted = new Intl.NumberFormat('en', {
              style: 'currency',
              currency: code,
              minimumFractionDigits: 0,
            }).format(0);

            symbols[code] = formatted.replace(/[\d,.\s]/g, '').trim();
          } catch {
            symbols[code] = code;
          }
        });

        setCurrencySymbols(symbols);
      })
      .catch((err) => console.error(err));
  }, []);

  // Normalize stored transactions on mount
  React.useEffect(() => {
    try {
      const stored = readLocalStorageJSON('transactions', []);

      if (Array.isArray(stored) && stored.length > 0) {
        const normalized = normalizeTransactions(stored, { currency });

        if (JSON.stringify(normalized) !== JSON.stringify(stored)) {
          setTransactions(normalized);
          localStorage.setItem('transactions', JSON.stringify(normalized));
        }
      }
    } catch (e) {
      console.error('Normalization failed', e);
    }
  }, []);

  const updateCurrency = async (selectedCurrency) => {
    if (selectedCurrency.code === currency.code) return;

    if (!transactions?.length) {
      setCurrency(selectedCurrency);
      localStorage.setItem('currency', JSON.stringify(selectedCurrency));
      return;
    }

    const confirmed = window.confirm(
      `Convert all transactions from ${currency.code} to ${selectedCurrency.code}?`
    );

    if (!confirmed) return;

    setConverting(true);

    try {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${currency.code}`
      );

      const data = await res.json();
      const rate = data.rates[selectedCurrency.code];

      if (!rate) throw new Error('Rate not found');

      const enrichedCurrency = {
        ...selectedCurrency,
        symbol:
          selectedCurrency.symbol ||
          currencySymbols[selectedCurrency.code] ||
          selectedCurrency.code,
      };

      const convertedTransactions = transactions.map((t) => {
        const parsed = Number(t.Amount);

        const amt = isNaN(parsed)
          ? t.Amount
          : (parsed * rate).toFixed(2);

        return normalizeTransaction(
          {
            ...t,
            Amount: amt,
            Currency: enrichedCurrency,
          },
          {
            currency: enrichedCurrency,
            source: t.source || 'conversion',
          }
        );
      });

      setTransactions(convertedTransactions);
      localStorage.setItem(
        'transactions',
        JSON.stringify(convertedTransactions)
      );

      setCurrency(enrichedCurrency);
      localStorage.setItem(
        'currency',
        JSON.stringify(enrichedCurrency)
      );
    } catch (err) {
      alert(
        'Failed to fetch exchange rate. Check your internet and try again.'
      );
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const deleteTransaction = (index) => {
    const updated = transactions.filter((_, i) => i !== index);

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  const addTransaction = (newTransaction) => {
    const normalized = normalizeTransaction(newTransaction, {
      currency,
      source: 'manual',
    });

    const updated = [...(transactions || []), normalized];

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  const updateTransaction = (index, updatedTransaction) => {
    const normalized = normalizeTransaction(updatedTransaction, {
      currency,
      source: 'edit',
    });

    const updated = transactions.map((t, i) =>
      i === index ? normalized : t
    );

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        setTransactions,
        currency,
        updateCurrency,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        converting,
      }}
    >
      {converting && (
        <div className="theme-overlay">
          <div
            role="status"
            aria-live="assertive"
            className="theme-overlay-card"
          >
            Converting transactions... please wait
          </div>
        </div>
      )}

      {children}
    </DataContext.Provider>
  );
}