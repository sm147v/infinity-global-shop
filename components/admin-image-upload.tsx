"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import { cloudinaryLoader } from "@/lib/image";

interface Props {
  productId: number;
  currentImage: string | null;
  currentImages?: string[];
}

export function AdminImageUpload({ productId, currentImage, currentImages = [] }: Props) {
  const [principal, setPrincipal] = useState(currentImage);
  const [images, setImages] = useState<string[]>([...currentImages, ...(currentImage && !currentImages.includes(currentImage) ? [currentImage] : [])].filter(Boolean));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function getToken() {
    return localStorage.getItem("adminToken") || "";
  }

  async function callApi(action: string, image: string) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/products/" + productId + "/image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": getToken() },
        body: JSON.stringify({ action, image }),
      });
      if (res.ok) {
        const data = await res.json();
        setImages(data.product.images || []);
        setPrincipal(data.product.image);
        setMessage("✅ Guardado");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage("❌ Error al guardar");
      }
    } catch {
      setMessage("❌ Error de conexión");
    }
    setSaving(false);
  }

  return (
    <div style={{ background: "#FDFAF3", borderRadius: 16, padding: "1rem", border: "1px solid #EDE3CD" }}>
      
      <div style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: "0.75rem",
        background: "linear-gradient(135deg, #EDE3CD, #A8B584)",
        border: principal ? "2px solid #4A5D3A" : "none",
        position: "relative",
      }}>
        {principal && (
          <Image
            src={principal}
            alt="Principal"
            fill
            sizes="600px"
            style={{ objectFit: "cover", objectPosition: "center" }}
            loader={cloudinaryLoader}
          />
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <button
                onClick={() => callApi("setPrincipal", img)}
                disabled={saving}
                title="Hacer principal"
                style={{
                  width: 50, height: 50,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: img === principal ? "2px solid #4A5D3A" : "1px solid #EDE3CD",
                  padding: 0,
                  cursor: saving ? "wait" : "pointer",
                  background: "#FDFAF3",
                  position: "relative",
                }}
              >
                <Image src={img} alt="" fill sizes="50px" style={{ objectFit: "cover" }} loader={cloudinaryLoader} />
              </button>
              <button
                onClick={() => callApi("remove", img)}
                disabled={saving}
                title="Eliminar"
                style={{
                  position: "absolute",
                  top: -4, right: -4,
                  width: 18, height: 18,
                  borderRadius: "50%",
                  background: "#C9533D",
                  color: "white",
                  border: "none",
                  fontSize: "0.7rem",
                  cursor: saving ? "wait" : "pointer",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess={(result: any) => {
          if (result?.info?.secure_url) {
            callApi("add", result.info.secure_url);
          }
        }}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            disabled={saving}
            style={{
              width: "100%",
              background: "#4A5D3A",
              color: "#F7F1E5",
              border: "none",
              padding: "0.7rem",
              borderRadius: 100,
              fontSize: "0.82rem",
              fontWeight: 500,
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.6 : 1,
              fontFamily: "inherit",
            }}
          >
            {saving ? "Guardando..." : images.length === 0 ? "📸 Subir primera imagen" : "+ Agregar imagen"}
          </button>
        )}
      </CldUploadWidget>

      {message && (
        <p style={{
          marginTop: "0.5rem",
          fontSize: "0.78rem",
          color: message.startsWith("✅") ? "#5C8A5E" : "#C9533D",
          textAlign: "center",
          margin: "0.5rem 0 0",
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
