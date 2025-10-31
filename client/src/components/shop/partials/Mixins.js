export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  carts.forEach((item) => {
    // handle old typo and new correct key
    const itemQty = Number(item.quantity || item.quantitiy || 0);
    if (item.id === id) {
      subTotalCost = itemQty * Number(price || item.price || 0);
    }
  });

  return subTotalCost;
};

export const quantity = (id) => {
  let productQty = 0;
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  carts.forEach((item) => {
    if (item.id === id) {
      productQty = Number(item.quantity || item.quantitiy || 0);
    }
  });

  return productQty;
};

export const totalCost = () => {
  let total = 0;
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  carts.forEach((item) => {
    const qty = Number(item.quantity || item.quantitiy || 0);
    const price = Number(item.price || 0);
    total += qty * price;
  });

  return total;
};
