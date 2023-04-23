export const fonts = () => {
	/// Converts pixels to percent using the default browser font size.
	const baseFontSize = (pixels: number, defaultFontSize = 16) => {
		return 100 * (pixels / defaultFontSize);
	};
	const fontBasic = `font-size: ${baseFontSize(10)}%;`;
	const fontFamily = `
    --font-cardo: "Cardo", Verdana, sans-serif;
    --font-cinzel: "Cinzel", Georgia, serif;
    --font-dosis: "Dosis", Verdana, sans-serif;
    --font-raleway: "Raleway", Verdana, sans-serif;
    --font-press: "Press Start 2P", Verdana, sans-serif;
    --font-verdana: Verdana, Geneva, Tahoma, sans-serif;
  `;
	const fontSize = `
    --font-size-9: 0.9rem;
    --font-size-10: 1.0rem;
    --font-size-11: 1.1rem;
    --font-size-12: 1.2rem;
    --font-size-13: 1.3rem;
    --font-size-14: 1.4rem;
    --font-size-15: 1.5rem;
    --font-size-16: 1.6rem;
    --font-size-18: 1.8rem;
    --font-size-20: 2.0rem;
    --font-size-22: 2.2rem;
    --font-size-24: 2.4rem;
    --font-size-28: 2.8rem;
    --font-size-32: 3.2rem;
  `;
	return fontBasic + fontFamily + fontSize;
};
