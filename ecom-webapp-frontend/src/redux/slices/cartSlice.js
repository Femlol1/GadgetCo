// Importing the createSlice function from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Initial state of the cart
const initialState = {
    cartItems: [], // Array to hold the items in the cart
    totalAmount: 0, // Total amount of the cart
    totalQuantity: 0, // Total quantity of items in the cart
};

// Creating the cart slice
const cartSlice = createSlice({
    name: "cart", // Name of the slice
    initialState, // Initial state
    reducers: {
        // Reducer to add an item to the cart
        addItem: (state, action) => {
            const newItem = action.payload; // The new item to be added
            const existingItem = state.cartItems.find(
                (item) => item.id === newItem.id
            ); // Checking if the item already exists in the cart

            state.totalQuantity++; // Increasing the total quantity

            // If the item does not exist in the cart, add it
            if (!existingItem) {
                state.cartItems.push({
                    id: newItem.id,
                    productName: newItem.productName,
                    imgUrl: newItem.imgUrl,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                // If the item exists, increase its quantity and update its total price
                existingItem.quantity++;
                existingItem.totalPrice =
                    Number(existingItem.totalPrice) + Number(newItem.price);
            }

            // Updating the total amount of the cart
            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );
        },
        // Reducer to delete an item from the cart
        deleteItem: (state, action) => {
            const id = action.payload; // The id of the item to be deleted
            const existingItem = state.cartItems.find((item) => item.id === id); // Finding the item in the cart

            // If the item exists, remove it from the cart and update the total quantity
            if (existingItem) {
                state.cartItems = state.cartItems.filter((item) => item.id !== id);
                state.totalQuantity = state.totalQuantity - existingItem.quantity;
            }
            // Updating the total amount of the cart
            state.totalAmount = state.cartItems.reduce(
                (total, item) => total + Number(item.price) * Number(item.quantity),
                0
            );
        },
        // Reducer to increase the quantity of an item in the cart
        increaseQuantity: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item.id === action.payload
            ); // Finding the item in the cart
            if (existingItem) {
                // If the item exists, increase its quantity and update its total price and the total quantity
                existingItem.quantity++;
                existingItem.totalPrice =
                    Number(existingItem.totalPrice) + Number(existingItem.price);
                state.totalQuantity++;
            }
            // Updating the total amount of the cart
            state.totalAmount = state.cartItems.reduce(
                (total, item) => Number(total) + Number(item.totalPrice),
                0
            );
        },
        // Reducer to decrease the quantity of an item in the cart
        decreaseQuantity: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item.id === action.payload
            ); // Finding the item in the cart
            if (existingItem && existingItem.quantity > 1) {
                // If the item exists and its quantity is more than 1, decrease its quantity and update its total price and the total quantity
                existingItem.quantity--;
                existingItem.totalPrice =
                    Number(existingItem.totalPrice) - Number(existingItem.price);
                state.totalQuantity--;
            }
            // Updating the total amount of the cart
            state.totalAmount = state.cartItems.reduce(
                (total, item) => Number(total) + Number(item.totalPrice),
                0
            );
        },
    },
});

// Exporting the actions
export const {
    addItem,
    deleteItem,
    increaseQuantity,
    decreaseQuantity,
} = cartSlice.actions;

// Exporting the reducer
export default cartSlice.reducer;