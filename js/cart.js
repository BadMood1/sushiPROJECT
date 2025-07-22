"use strict";

// Div внутри корзины, в который добавляем товары
const cartWrapper = document.querySelector(".cart-wrapper");

export let cartItems = [];

if (localStorage.getItem("cartItems")) {
    console.log("GOT ITEMS");
    // Используем тот же массив, так как иначе ломаются некоторые процессы
    cartItems = JSON.parse(localStorage.getItem("cartItems"));

    cartItems.forEach((item) => addToCart(item));
}

import { checkEmptyCart } from "./toggleCartStatus.js";
import { calcCartPriceAndDelivery } from "./calcCartPrice.js";

checkEmptyCart();
calcCartPriceAndDelivery();

// Обработчик для кнопки "в корзину"
document.addEventListener("click", function (event) {
    if (!event.target.hasAttribute("data-cart")) return;

    const card = event.target.closest(".card"); // Карта товара(ролла)

    // Получаем из карты данные, формируем объект для товара
    const productInfo = {
        id: card.dataset.id,
        imgSrc: card.querySelector(".product-img").getAttribute("src"),
        title: card.querySelector(".item-title").innerText,
        itemsInBox: card.querySelector("[data-items-in-box]").innerText,
        weight: card.querySelector(".price__weight").innerText,
        price: card.querySelector(".price__currency").innerText,
        counter: card.querySelector("[data-counter]").innerText,
    };

    // Если нет товара в корзине, то сразу пушим в массив данные(копии не будет)
    if (!addToCart(productInfo)) cartItems.push(productInfo); // JSON внутри функции

    card.querySelector("[data-counter]").innerText = 1; // Сброс счетчика

    checkEmptyCart();
    saveToLocalStorage();
});

// function addToCart(info) {
//     // Сначала проверяем если есть товар в корзине

//     const cartItems = cartWrapper.children;
//     let itemInCart,
//         alreadyInCart = false;

//     // Ищем по айди есть ли наш товар. Если да, то сохраняем и обозначаем это
//     for (let i = 0; i < cartItems.length; i++) {
//         if (cartItems[i].dataset.id === info.id) {
//             itemInCart = cartItems[i];
//             alreadyInCart = true;
//         }
//     }

//     if (alreadyInCart) {
//         const counter = itemInCart.querySelector("[data-counter]");
//         let countValue = parseInt(counter.textContent);

//         countValue += Number(info.counter);

//         counter.textContent = countValue;

//         return; // Нам не нужно создавать новый элемент, обновили уже существующий
//     }

//     const itemHTML = `<div class="cart-item" data-id="${info.id}">
//                                     <div class="cart-item__top">
//                                         <div class="cart-item__img">
//                                             <img src="${info.imgSrc}" alt="" />
//                                         </div>
//                                         <div class="cart-item__desc">
//                                             <div class="cart-item__title">Калифорния темпура</div>
//                                             <div class="cart-item__weight">${info.itemsInBox} / ${info.weight}</div>

//                                             <!-- cart-item__details -->
//                                             <div class="cart-item__details">
//                                                 <div class="items items--small counter-wrapper">
//                                                     <div class="items__control" data-action="minus">-</div>
//                                                     <div class="items__current" data-counter="">${info.counter}</div>
//                                                     <div class="items__control" data-action="plus">+</div>
//                                                 </div>

//                                                 <div class="price">
//                                                     <div class="price__currency">${info.price}</div>
//                                                 </div>
//                                             </div>
//                                             <!-- // cart-item__details -->
//                                         </div>
//                                     </div>
//                                 </div>`;
//     cartWrapper.insertAdjacentHTML("beforeend", itemHTML);
// }

function addToCart(info) {
    // Более грамотная реализация
    const itemInCart = cartWrapper.querySelector(`[data-id='${info.id}']`);

    // const cartItems = cartWrapper.children;
    // Ищем по айди есть ли наш товар. Если да, то сохраняем и обозначаем это
    // for (let i = 0; i < cartItems.length; i++) {
    //     if (cartItems[i].dataset.id === info.id) {
    //         itemInCart = cartItems[i];
    //         alreadyInCart = true;
    //     }
    // }

    if (itemInCart) {
        const counter = itemInCart.querySelector("[data-counter]");
        let countValue = parseInt(counter.textContent);

        countValue += Number(info.counter);

        counter.textContent = countValue;

        // Теперь в соответствующем объекте из cartItems нужно заменить counter.
        // Ищем объект в cartItems. Для этого возьмём id - возьмём info.id(айди везде одинаковый)
        const foundObjectToChange = cartItems.find((item) => item.id === info.id);
        foundObjectToChange.counter = String(countValue);
        console.log(foundObjectToChange);
        calcCartPriceAndDelivery();

        return true; // Нам не нужно создавать новый элемент, обновили уже существующий
    }

    const itemHTML = `<div class="cart-item" data-id="${info.id}">
                                    <div class="cart-item__top">
                                        <div class="cart-item__img">
                                            <img src="${info.imgSrc}" alt="" />
                                        </div>
                                        <div class="cart-item__desc">
                                            <div class="cart-item__title">${info.title}</div>
                                            <div class="cart-item__weight">${info.itemsInBox} / ${info.weight}</div>

                                            <!-- cart-item__details -->
                                            <div class="cart-item__details">
                                                <div class="items items--small counter-wrapper">
                                                    <div class="items__control" data-action="minus">-</div>
                                                    <div class="items__current" data-counter="">${info.counter}</div>
                                                    <div class="items__control" data-action="plus">+</div>
                                                </div>

                                                <div class="price">
                                                    <div class="price__currency">${info.price}</div>
                                                </div>
                                            </div>
                                            <!-- // cart-item__details -->
                                        </div>
                                    </div>
                                </div>`;

    cartWrapper.insertAdjacentHTML("beforeend", itemHTML);

    calcCartPriceAndDelivery(); // После добавления изменяем цену в корзине
}

export function saveToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("saved!");
}
