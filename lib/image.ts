/**
 * Cloudinary loader optimizado.
 *
 * Cambios clave para velocidad:
 * - Limita ancho a 1600px máx (en vez de 3840)
 * - Calidad auto (Cloudinary elige la mejor compresión)
 * - Formato auto (WebP o AVIF según navegador, mucho más liviano)
 * - DPR auto (Retina sin pesar el doble)
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Si no es Cloudinary, devolver tal cual
  if (!src.includes("cloudinary.com")) {
    return src;
  }

  // Limitar ancho máximo (no necesitamos 3840px nunca)
  const w = Math.min(width, 1600);

  // Calidad: 75 por defecto (no se ve diferencia con 100)
  const q = quality || 75;

  // Si la URL ya tiene transformaciones, las reemplazamos
  const transformations = `w_${w},c_limit,f_auto,q_${q},dpr_auto`;

  // Insertar transformaciones después de /upload/
  if (src.includes("/upload/")) {
    return src.replace(/\/upload\/[^/]+\//, `/upload/${transformations}/`).replace(/\/upload\/(v\d+\/)/, `/upload/${transformations}/$1`);
  }

  return src.replace("/upload/", `/upload/${transformations}/`);
}
