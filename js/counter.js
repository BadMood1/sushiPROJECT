"use strict";

// const btnMinus = document.querySelector('[data-action="minus"]'); // Ищем по data-атрибуту

// const btnPlus = document.querySelector('[data-action="plus"]');

// Обработчики

// btnMinus.addEventListener("click", function () {
//     const btnCounter = btnMinus.closest(".counter-wrapper").querySelector("[data-counter]");

//     if (Number(btnCounter.innerHTML) === 1) return;
//     btnCounter.textContent -= 1;
// });

// btnPlus.addEventListener("click", function () {
//     const btnCounter = btnPlus.closest(".counter-wrapper").querySelector("[data-counter]");

//     let countValue = parseInt(btnCounter.innerText);
//     countValue++;

//     btnCounter.innerText = countValue;
// });

/*document.addEventListener("click", function (event) {
    if (event.target.dataset.action !== "minus") return;

    const btnMinus = event.target;
    const btnCounter = btnMinus.closest(".counter-wrapper").querySelector("[data-counter]");

    let countValue = parseInt(btnCounter.innerText);
    if (countValue === 1 || countValue < 1) return;

    btnCounter.innerText = --countValue;
});

document.addEventListener("click", function (event) {
    if (event.target.dataset.action !== "plus") return;

    const btnPlus = event.target;
    const btnCounter = btnPlus.closest(".counter-wrapper").querySelector("[data-counter]");

    let countValue = parseInt(btnCounter.innerText);

    btnCounter.innerText = ++countValue;
});
*/

// Импортируем функцию проверки пустая ли корзина
import { checkEmptyCart } from "./toggleCartStatus.js";
import { calcCartPriceAndDelivery } from "./calcCartPrice.js";
import { cartItems, saveToLocalStorage } from "./cart.js";

// Обработка счетчиков
document.addEventListener("click", function (event) {
    const action = event.target.dataset.action;
    if (action !== "minus" && action !== "plus") return;

    const button = event.target;
    const counter = button.closest(".counter-wrapper").querySelector("[data-counter]");
    const cartItem = counter.closest(".cart-item");

    let countValue = parseInt(counter.textContent);

    if (action === "minus") {
        // МЕНЮ
        if (counter.closest(".col-md-6") && countValue > 1) {
            counter.textContent = --countValue;

            // Меняем цену соответственно счетчику
            const detailsWrapper = counter.closest(".details-wrapper");
            const price = detailsWrapper.querySelector(".price__currency");
            const multiplier = parseInt(counter.textContent);

            price.textContent = `${multiplier * price.dataset.fixedPrice} ₽`;
        }

        // КОРЗИНА

        if (counter.closest(".cart-wrapper")) {
            // Может понадобится для двух условий других, поэтому выносим отдельно
            const indexToChangeItem = cartItems.findIndex((item) => item.id === cartItem.dataset.id); // внутри cartItem

            if (countValue > 1) {
                counter.textContent = --countValue;

                // JSON

                cartItems[indexToChangeItem].counter = counter.textContent;
            }

            // Если 1 элемент в КОРЗИНЕ, то удаляем
            else if (counter.closest(".cart-wrapper") && countValue === 1) {
                // Сначала разберемся с JSON (удалим из массива)
                let testDeleted = cartItems.splice(indexToChangeItem, 1);

                deleteFromCart(counter); // Удаляем последний товар из корзины
                checkEmptyCart(); // Добавляем "Корзина пуста"
                calcCartPriceAndDelivery();
            }

            saveToLocalStorage();
        }
    } else {
        // Обрабатываем увеличение счётчика

        // МЕНЮ
        if (counter.closest(".col-md-6") && countValue > 0) {
            counter.textContent = ++countValue;

            // Меняем цену соответственно счетчику
            const detailsWrapper = counter.closest(".details-wrapper");
            const price = detailsWrapper.querySelector(".price__currency");
            const multiplier = parseInt(counter.textContent);

            price.textContent = `${multiplier * price.dataset.fixedPrice} ₽`;
        }

        // КОРЗИНА
        if (counter.closest(".cart-wrapper") && countValue > 0) {
            counter.textContent = ++countValue;

            // JSON
            const indexToChangeItem = cartItems.findIndex((item) => item.id === cartItem.dataset.id); // внутри cartItem
            cartItems[indexToChangeItem].counter = counter.textContent;

            saveToLocalStorage();
        }
    }
    // Проверяем, что мы внутри корзины, чтобы не вызывать в лишний раз calcCartPriceAndDelivery();
    if (counter.closest(".cart-wrapper")) calcCartPriceAndDelivery();
});

//
function deleteFromCart(counter) {
    const cartItem = counter.closest(".cart-item");
    cartItem.remove();
}
