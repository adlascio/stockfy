import React, { useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const TransactionsContext = React.createContext();

export function useTransactions() {
  return useContext(TransactionsContext);
}

export function TransactionsProvider({ children }) {
  const transactionsCollectionRef = collection(db, "Transactions");
  const [transactions, setTransactions] = useState({
    list: [],
  });

  const getTransactions = async () => {
    try {
      const data = await getDocs(transactionsCollectionRef);
      const updatedTransactionsList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTransactions({
        ...transactions,
        list: updatedTransactionsList,
      });
    } catch (error) {
      console.log("error at fetching transactions", error);
    }
  };

  const saveTransaction = async (transaction) => {
    try {
      const response = await addDoc(transactionsCollectionRef, transaction);
      console.log("response", response);
      setTransactions({
        list: [...transactions.list, { ...transaction, id: response.id }],
        isLoading: false,
      });
    } catch (e) {
      console.log("error at adding new transaction", e);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const transactionDoc = doc(db, "Transactions", id);
      await deleteDoc(transactionDoc);
      await getTransactions();
    } catch (e) {
      console.log("error at deleting transaction", e);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);
  return (
    <TransactionsContext.Provider
      value={{
        saveTransaction,
        deleteTransaction,
        transactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
