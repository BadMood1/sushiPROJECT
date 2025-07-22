"use strict";

const cartWrapper = document.querySelector(".cart-wrapper");
const emptyCartBlock = document.querySelector("[data-cart-empty]");
const orderForm = document.querySelector("#order-form");

export function checkEmptyCart() {
    if (cartWrapper.children.length > 0) {
        emptyCartBlock.classList.add("none");
        orderForm.classList.remove("none");
    } else {
        emptyCartBlock.classList.remove("none");
        orderForm.classList.add("none");
    }
}
