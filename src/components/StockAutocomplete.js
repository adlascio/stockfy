import React from "react";
import { ListGroupItem } from "react-bootstrap";

const StockAutocomplete = ({ stockList, handleOnClick }) => {
  if (stockList.length === 0)
    return (
      <ListGroupItem>
        <span>No results found</span>
      </ListGroupItem>
    );
  return stockList.map((stock) => (
    <ListGroupItem
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "2rem",
      }}
      onClick={() => handleOnClick(stock["1. symbol"], stock["8. currency"])}
      key={stock["1. symbol"]}
    >
      <span>{stock["1. symbol"]}</span>
      <span style={{ color: "gray", fontSize: ".8rem" }}>
        {stock["2. name"]}
      </span>
    </ListGroupItem>
  ));
};

export default StockAutocomplete;
