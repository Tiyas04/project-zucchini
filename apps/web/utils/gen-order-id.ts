import axios from "axios";

export async function generateOrderId() {
  try {
    const response = await axios.post("/api/intiate-order");
    console.log("Order Response:", response.data);

    if (response.data.success) {
      return response.data.data.orderId;
    } else {
      throw new Error(response.data.error || "Failed to create order");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
}
