import { createContext, useState, useEffect } from "react";

export const addCartItemHelper = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

export const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

export const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},

  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},

  clearItemFromCart: () => {},

  cartCount: 0,
  cartTotal: 0,
});

export const CartProvider = ({ children }) => {
  const [isCartOpenState, setIsCartOpenState] = useState(false);
  const [cartItemsState, setCartItemsState] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const newCartCount = cartItemsState.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    setCartCount(newCartCount);
  }, [cartItemsState]);

  useEffect(() => {
    const newTotalCount = cartItemsState.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );
    setCartTotal(newTotalCount);
  }, [cartItemsState]);

  const addItemToCartSetter = (productToAdd) => {
    const newCartItems = addCartItemHelper(cartItemsState, productToAdd);

    // console.log(newCartItems);

    setCartItemsState(newCartItems);
  };

  const removeItemFromCart = (cartItemToRemove) => {
    const newCartItems = removeCartItem(cartItemsState, cartItemToRemove);
    setCartItemsState(newCartItems);
  };

  const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = clearCartItem(cartItemsState, cartItemToClear);
    setCartItemsState(newCartItems);
  };

  const value = {
    isCartOpen: isCartOpenState,
    setIsCartOpen: setIsCartOpenState,
    addItemToCart: addItemToCartSetter,
    removeItemFromCart: removeItemFromCart,
    clearItemFromCart: clearItemFromCart,
    cartItems: cartItemsState,
    cartCount: cartCount,
    cartTotal: cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
