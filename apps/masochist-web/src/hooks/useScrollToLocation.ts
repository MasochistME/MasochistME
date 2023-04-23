import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToLocation = () => {
	const scrolledRef = useRef(false);
	const { hash } = useLocation();
	const hashRef = useRef(hash);

	useEffect(() => {
		if (!hash) return;

		// Replace the hash if it has changed.
		if (hashRef.current !== hash) {
			hashRef.current = hash;
			scrolledRef.current = false;
		}

		// Do not scroll if it's already scrolled to the element.
		if (!scrolledRef.current) {
			const id = hash.replace('#', '');
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
				scrolledRef.current = true;
			}
		}
	});
};
