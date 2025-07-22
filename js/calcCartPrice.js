"use strict";

export function calcCartPriceAndDelivery() {
    const priceEl = document.querySelector(".total-price");
    let totalPriceValue = 0;

    let items = document.querySelectorAll(".cart-item");

    items.forEach((item) => {
        const itemPrice = parseInt(item.querySelector(".price__currency").textContent);
        const quantity = parseInt(item.querySelector("[data-counter]").textContent);
        totalPriceValue += quantity * itemPrice;
    });

    priceEl.textContent = totalPriceValue;

    // Доставка

    const deliveryPrice = document.querySelector(".delivery-cost");
    const deliveryEl = document.querySelector("[data-cart-delivery");
    const deliveryInfo = deliveryEl.querySelector(".delivery-info");
    const freeDelivPrice = 600;
    // Скрываем/Показываем стоимость доставки
    if (totalPriceValue === 0) deliveryEl.classList.add("none");
    else {
        deliveryEl.classList.remove("none");
    }

    // Разбираемся с ценой доставки
    if (totalPriceValue >= freeDelivPrice) {
        deliveryPrice.classList.add("free");
        deliveryPrice.textContent = "бесплатно";
        deliveryInfo.textContent = "";
    } else {
        deliveryPrice.classList.remove("free");
        deliveryPrice.innerText = `250 ₽`;
        deliveryInfo.textContent = `${freeDelivPrice - totalPriceValue} ₽ до бесплатной`;
    }
}
