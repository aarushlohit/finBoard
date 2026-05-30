import { useEffect, useState } from 'react';

const DEFAULT_STORAGE_KEY = 'transactions';

function readStoredTransactions(storageKey) {
	if (typeof window === 'undefined') {
		return [];
	}

	try {
		const storedValue = window.localStorage.getItem(storageKey);
		if (!storedValue) {
			return [];
		}

		const parsedValue = JSON.parse(storedValue);
		return Array.isArray(parsedValue) ? parsedValue : [];
	} catch {
		return [];
	}
}

export default function useTransactions(options = {}) {
	const {
		storageKey = DEFAULT_STORAGE_KEY,
		initialTransactions = [],
		persist = true,
	} = options;

	const [transactions, setTransactions] = useState(() => {
		const storedTransactions = readStoredTransactions(storageKey);
		return storedTransactions.length > 0 ? storedTransactions : initialTransactions;
	});

	useEffect(() => {
		if (!persist || typeof window === 'undefined') {
			return;
		}

		window.localStorage.setItem(storageKey, JSON.stringify(transactions));
	}, [persist, storageKey, transactions]);

	const addTransaction = (transaction) => {
		setTransactions((currentTransactions) => [...currentTransactions, transaction]);
	};

	const updateTransaction = (index, updatedTransaction) => {
		setTransactions((currentTransactions) =>
			currentTransactions.map((transaction, currentIndex) =>
				currentIndex === index ? updatedTransaction : transaction
			)
		);
	};

	const deleteTransaction = (index) => {
		setTransactions((currentTransactions) =>
			currentTransactions.filter((_, currentIndex) => currentIndex !== index)
		);
	};

	const clearTransactions = () => {
		setTransactions([]);

		if (persist && typeof window !== 'undefined') {
			window.localStorage.removeItem(storageKey);
		}
	};

	return {
		transactions,
		setTransactions,
		addTransaction,
		updateTransaction,
		deleteTransaction,
		clearTransactions,
	};
}
