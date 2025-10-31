

// ===== Wishlist Helpers =====
export const isWish = (id, wList) => {
  if (Array.isArray(wList) && wList.includes(id)) {
    return true;
  }
  return false;
};

export const isWishReq = (e, id, setWlist) => {
  let list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];

  if (!Array.isArray(list)) list = [];

  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem("wishList", JSON.stringify(list));
    setWlist(list);
  }
};

export const unWishReq = (e, id, setWlist) => {
  let list = localStorage.getItem("wishList")
    ? JSON.parse(localStorage.getItem("wishList"))
    : [];

  if (!Array.isArray(list)) list = [];

  if (list.includes(id)) {
    list = list.filter((item) => item !== id);
    localStorage.setItem("wishList", JSON.stringify(list));
    setWlist(list);
  }
};

// ===== Slider Controls =====
export const nextSlide = (totalImg, slide, setSlide) => {
  if (slide >= totalImg - 1) {
    setSlide(0);
  } else {
    setSlide(slide + 1);
  }
};

export const prevSlide = (totalImg, slide, setSlide) => {
  if (slide <= 0) {
    setSlide(totalImg - 1);
  } else {
    setSlide(slide - 1);
  }
};

// ===== Cart Helpers =====
export const totalCost = (cart) => {
  // Prevent crash if cart is null or undefined
  if (!Array.isArray(cart)) return 0;

  let total = 0;
  cart.forEach((item) => {
    const price = item?.price || 0;
    const qty = item?.quantity || 1;
    total += price * qty;
  });

  return total;
};

export const totalItems = (cart) => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((count, item) => count + (item?.quantity || 0), 0);
};
