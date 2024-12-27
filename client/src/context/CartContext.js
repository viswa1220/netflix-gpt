import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;

        if (newQuantity > existingItem.availableCount) {
          toast.error(
            `Cannot add more than ${existingItem.availableCount} items for ${existingItem.name}.`
          );
          return prevItems;
        }

        updatedItems[existingItemIndex].quantity = newQuantity;
        toast.success(`${existingItem.name} quantity updated to ${newQuantity}.`);
        return updatedItems;
      } else {
        if (newItem.quantity > newItem.availableCount) {
          toast.error(
            `Cannot add more than ${newItem.availableCount} items for ${newItem.name}.`
          );
          return prevItems;
        }

        toast.success(`${newItem.name} added to cart.`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.color === itemToRemove.color &&
            item.size === itemToRemove.size
          )
      )
    );
    toast.info(`${itemToRemove.name} removed from cart.`);
  };

  const updateQuantity = (itemToUpdate, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (
          item.id === itemToUpdate.id &&
          item.color === itemToUpdate.color &&
          item.size === itemToUpdate.size
        ) {
          const newQuantity = item.quantity + delta;

          if (newQuantity < 1) {
            toast.error("Quantity cannot be less than 1.");
            return item;
          }

          if (newQuantity > item.availableCount) {
            toast.error(
              `Cannot exceed available stock of ${item.availableCount} for ${item.name}.`
            );
            return item;
          }

          toast.success(`${item.name} quantity updated to ${newQuantity}.`);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
