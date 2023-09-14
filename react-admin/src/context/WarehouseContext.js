import React, { useState, createContext } from "react";

export const WarehouseContext = createContext();

export const WarehouseContextProvider = (props) => {
  const [clients, setClients] = useState([]);
  const [clientAddresses, setClientAddresses] = useState([]);
  const [clientOrders, setClientOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);

  const addClients = (client) => {
    setClients([client, ...clients]);
  };
  const addClientAddresses = (address) => {
    setClientAddresses([address, ...clientAddresses]);
  };
  const addClientOrders = (clientOrder) => {
    setClientOrders([clientOrder, ...clientOrders]);
  };
  const addProducts = (product) => {
    setProducts([product, ...products]);
  };
  const addProductsOrder = (orderProduct) => {
    setOrderProducts([orderProduct, ...orderProducts]);
  };
  return (
    <WarehouseContext.Provider
      value={{
        setClients,
        clients,
        addClients,
        setClientAddresses,
        clientAddresses,
        addClientAddresses,
        setClientOrders,
        clientOrders,
        addClientOrders,
        setProducts,
        products,
        addProducts,
        setOrderProducts,
        orderProducts,
        addProductsOrder,
      }}
    >
      {props.children}
    </WarehouseContext.Provider>
  );
};
