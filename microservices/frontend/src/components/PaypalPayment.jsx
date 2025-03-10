import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

// this component is about the paypal payment buttons
// the code below is an adaptation of the code provided in the paypal docs
class PaypalPayment extends React.Component {
  constructor(props) {
    super(props);
  }
  //create a new paypal order for credits
  createOrder(data) {
    // Order is created on the server and the order id is returned
    return fetch("http://localhost:8080/pay/paypal/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        cart: [
          {
            id: "1",
            name: "Credits for Solvio",
            quantity: `${this.props.credits}`,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }
  // after the buyer approves the payment, capture the money
  onApprove(data) {
    // Order is captured on the server  /paypal/orders/:orderID/capture
    return fetch(
      `http://localhost:8080/pay/paypal/orders/${data.orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: `${this.props.credits}`,
        }),
      }
    )
      .then((response) => response.json())
      .then(() =>
        this.props.onNotifyPaypal(`You received ${this.props.credits} credits`)
      );
  }
  render() {
    return (
      <PayPalButtons
        createOrder={(data, actions) => this.createOrder(data)}
        onApprove={(data, actions) => this.onApprove(data)}
      />
    );
  }
}

export default PaypalPayment;
