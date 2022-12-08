import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTransactions } from "../contexts/TransactionsContext";

export default function Dashboard() {
  const { transactions } = useTransactions();

  return (
    <>
      <div className="insights">
        <div className="sales">
          <span className="material-icons-sharp insights__icon">equalizer</span>
          <div className="middle">
            <h3>Total Equity</h3>
            <h1>$25,024</h1>
          </div>
          <small className="text-muted">~20 minutes delay</small>
        </div>
        <div className="dividends">
          <span className="material-icons-sharp insights__icon">savings</span>
          <div className="middle">
            <h3>Total Dividends</h3>
            <h1>$234</h1>
          </div>
          <small className="text-muted">Last Month</small>
        </div>
        <div className="expenses">
          <span className="material-icons-sharp insights__icon">
            price_change
          </span>
          <div className="middle">
            <div className="left">
              <h3>Profit/Loss</h3>
              <h1>$9,561</h1>
            </div>
          </div>
          <small className="text-muted">Last 24 hours</small>
        </div>
        <div className="income">
          <span className="material-icons-sharp insights__icon">
            stacked_line_chart
          </span>
          <div className="middle">
            <div className="left">
              <h3>Total Profit/Loss</h3>
              <h1>$12,387</h1>
            </div>
          </div>
          <small className="text-muted">All time</small>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Stocks / ETFs</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Transaction Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.list.map((transaction, index) => (
              <tr key={index} className="slices__row">
                <td>{index + 1}</td>
                <td>{transaction.stock_code}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.price}</td>
                <td>{transaction.transaction_date}</td>
                <td>{transaction.action}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="show-all">
          <Link to="/transactions"> Show all</Link>
        </div>
      </div>
    </>
  );
}
