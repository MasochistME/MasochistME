export const getImageMask = async (imgSrc: string): Promise<string> =>
  new Promise(resolve => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
