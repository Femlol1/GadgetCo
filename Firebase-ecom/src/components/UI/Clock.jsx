// import React, { useEffect, useState } from "react";
// import "../../styles/clock.css";

// const Clock = () => {
//   const [days, setDays] = useState();
//   const [hours, setHours] = useState();
//   const [minutes, setMinutes] = useState();
//   const [seconds, setSeconds] = useState();

//   let interval;

//   const countdown = () => {
//     const destination = new Date("Feb 29, 2024").getTime();
//     interval = setInterval(() => {
//       const now = new Date().getTime();
//       const different = destination - now;
//       const days = Math.floor(different / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (different % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       const minutes = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((different % (1000 * 60)) / 1000);

//       if (destination < 0) clearInterval(interval.current);
//       else {
//         setDays(days);
//         setHours(hours);
//         setMinutes(minutes);
//         setSeconds(seconds);
//       }
//     });
//   };
//   useEffect(() => {
//     countdown();
//   });

//   return (
//     <div className="clock__wrapper d-flex align-items-center gap-3">
//       <div className="clock__data d-flex align-items-center gap-3">
//         <div className="text-center">
//           <h1 className="text-white fs-3 mb-2">{days} </h1>
//           <h5 className="text-white fs-6">Days</h5>
//         </div>
//         <span className="text-white fs-3">:</span>
//       </div>
//       <div className="clock__data d-flex align-items-center gap-3">
//         <div className="text-center">
//           <h1 className="text-white fs-3 mb-2">{hours} </h1>
//           <h5 className="text-white fs-6">Hours</h5>
//         </div>
//         <span className="text-white fs-3">:</span>
//       </div>
//       <div className="clock__data d-flex align-items-center gap-3">
//         <div className="text-center">
//           <h1 className="text-white fs-3 mb-2">{minutes} </h1>
//           <h5 className="text-white fs-6">Minutes</h5>
//         </div>
//         <span className="text-white fs-3">:</span>
//       </div>
//       <div className="clock__data d-flex align-items-center gap-3">
//         <div className="text-center">
//           <h1 className="text-white fs-3 mb-2">{seconds} </h1>
//           <h5 className="text-white fs-6">Seconds</h5>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Clock;

import React, { useEffect, useState } from "react";
import "../../styles/clock.css";

const Clock = () => {
	const [days, setDays] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [isActive, setIsActive] = useState(true); // New state to control visibility

	useEffect(() => {
		const destination = new Date("Feb 20, 2024").getTime();
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const difference = destination - now;

			if (difference < 0) {
				clearInterval(interval);
				setIsActive(false); // Hide the timer when the countdown is over
			} else {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor(
					(difference % (1000 * 60 * 60)) / (1000 * 60)
				);
				const seconds = Math.floor((difference % (1000 * 60)) / 1000);

				setDays(days);
				setHours(hours);
				setMinutes(minutes);
				setSeconds(seconds);
			}
		}, 1000);

		return () => clearInterval(interval); // Clean up the interval on component unmount
	}, []);

	// Conditionally render the timer based on isActive state
	return isActive ? (
		<div className="clock__wrapper d-flex align-items-center gap-3">
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{days}</h1>
					<h5 className="text-white fs-6">Days</h5>
				</div>
				<span className="text-white fs-3">:</span>
			</div>
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{hours}</h1>
					<h5 className="text-white fs-6">Hours</h5>
				</div>
				<span className="text-white fs-3">:</span>
			</div>
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{minutes}</h1>
					<h5 className="text-white fs-6">Minutes</h5>
				</div>
				<span className="text-white fs-3">:</span>
			</div>
			<div className="clock__data d-flex align-items-center gap-3">
				<div className="text-center">
					<h1 className="text-white fs-3 mb-2">{seconds}</h1>
					<h5 className="text-white fs-6">Seconds</h5>
				</div>
			</div>
		</div>
	) : null; // Don't render anything if the countdown is over
};

export default Clock;
