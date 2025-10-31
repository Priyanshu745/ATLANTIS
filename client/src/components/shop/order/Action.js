import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    const responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(() => {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.error("Fetch data error:", error.message);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    const responseData = await getBrainTreeToken();
    if (responseData && responseData.clientToken) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
    }
  } catch (error) {
    console.error("Braintree token fetch error:", error.message);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  let isUnmounted = false;
  const safeSetState = (update) => {
    if (!isUnmounted) setState(update);
  };

  try {
    if (!state.address) {
      safeSetState({ ...state, error: "Please provide your address" });
      return;
    }

    if (!state.phone) {
      safeSetState({ ...state, error: "Please provide your phone number" });
      return;
    }

    // Get payment method
    const dataObj = await state.instance.requestPaymentMethod();
    dispatch({ type: "loading", payload: true });

    const paymentData = {
      amountTotal: totalCost(),
      paymentMethod: dataObj.nonce,
    };

    // Process payment
    const res = await getPaymentProcess(paymentData);

    // ✅ Defensive check
    if (!res || !res.transaction) {
      console.error("Unexpected payment response:", res);
      safeSetState({
        ...state,
        error: "Payment failed. Please try again or check your Braintree config.",
      });
      dispatch({ type: "loading", payload: false });
      return;
    }

    const orderData = {
      allProduct: JSON.parse(localStorage.getItem("cart")),
      user: JSON.parse(localStorage.getItem("jwt")).user._id,
      amount: res.transaction.amount || 0,
      transactionId: res.transaction.id || "N/A",
      address: state.address,
      phone: state.phone,
    };

    const responseData = await createOrder(orderData);

    if (responseData.success) {
      localStorage.setItem("cart", JSON.stringify([]));
      dispatch({ type: "cartProduct", payload: null });
      dispatch({ type: "cartTotalCost", payload: null });
      dispatch({ type: "orderSuccess", payload: true });

      safeSetState({ clientToken: "", instance: {} });
      dispatch({ type: "loading", payload: false });

      // Mark unmounted BEFORE navigating
      isUnmounted = true;
      history.push("/");
    } else if (responseData.error) {
      console.error("Order creation failed:", responseData.error);
      safeSetState({ ...state, error: "Order creation failed." });
    }
  } catch (err) {
    console.error("Payment error:", err.message);
    safeSetState({ ...state, error: err.message });
  }

  return () => {
    isUnmounted = true;
  };
};
