import React, { useEffect, useState } from "react";
import "../../styles/clock.css";

const Clock = () => {
	const [days, setDays] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	const countdown = () => {
		const destination = new Date("May 03, 2024 00:00:00").getTime();
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const different = destination - now;
			const days = Math.floor(different / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(different % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((different % (1000 * 60)) / 1000);

			if (different < 0) {
				clearInterval(interval);
				setDays(0);
				setHours(0);
				setMinutes(0);
				setSeconds(0);
			} else {
				setDays(days);
				setHours(hours);
				setMinutes(minutes);
				setSeconds(seconds);
			}
		}, 1000);

		return () => clearInterval(interval);
	};

	useEffect(() => {
		countdown();
		// Clear the interval on component unmount
		return countdown;
	}, []);

	return (
		<div className="clock__wrapper d-flex align-items-center gap-3">
			{/* Days */}
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{days}</h1>
					<h5 className="text-white fs-6">Days</h5>
				</div>
				<span className="text-white fs-3">:</span>
			</div>
			{/* Hours */}
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{hours}</h1>
					<h5 className="text-white fs-6">Hours</h5>
				</div>
				<span className="text-white fs-3">:</span>
			</div>
			{/* Minutes */}
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{minutes}</h1>
					<h5 className="text-white fs-6">Minutes</h5>
				</div>
				<span className="text-white fs-3">:</span>
			</div>
			{/* Seconds */}
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{seconds}</h1>
					<h5 className="text-white fs-6">Seconds</h5>
				</div>
			</div>
		</div>
	);
};

export default Clock;
