import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";

import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("Add your key here");

export default function StripeCheckout() {
	const [clientSecret, setClientSecret] = useState("");

	useEffect(() => {
		fetch("https://ed-5581560718950400.educative.run/create-payment-intent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items: [{}] }),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			})
			.then((data) => setClientSecret(data.clientSecret))
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const options = {
		clientSecret,
	};

	return (
		<div>
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)}
		</div>
	);
}
