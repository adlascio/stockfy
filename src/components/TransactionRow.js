import React from "react";
import { useTransactions } from "../contexts/TransactionsContext";

const TransactionRow = ({ index, transaction }) => {
  const { deleteTransaction } = useTransactions();
  return (
    <tr key={index} className="slices__row">
      <td>{index + 1}</td>
      <td>{transaction.stock_code}</td>
      <td>{transaction.quantity}</td>
      <td>{transaction.price}</td>
      <td>{transaction.transaction_date}</td>
      <td>{transaction.action}</td>
      <td>
        {" "}
        <i
          className="uil uil-trash-alt"
          onClick={() => deleteTransaction(transaction.id)}
        ></i>
      </td>
    </tr>
  );
};

export default TransactionRow;
