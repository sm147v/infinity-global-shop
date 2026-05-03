"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

interface Props {
  productId: number;
  currentImage: string | null;
}

export function AdminImageUpload({ productId, currentImage }: Props) {
  const [image, setImage] = useState(currentImage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveImage(url: string) {
    setSaving(true);
    setMessage("");
    const token = localStorage.getItem("adminToken") || "";
    const res = await fetch(`/api/products/${productId}/image`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ image: url }),
    });
    if (res.ok) {
      setImage(url);
      setMessage("✅ Imagen actualizada");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("❌ Error al guardar");
    }
    setSaving(false);
  }

  return (
    <div style={{
      background: "#FDFAF3",
      borderRadius: 16,
      padding: "1rem",
      border: "1px solid #EDE3CD",
    }}>
      <div style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: "0.75rem",
        background: "linear-gradient(135deg, #EDE3CD, #A8B584)",
      }}>
        {image && (
          <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          if (result?.info?.secure_url) {
            saveImage(result.info.secure_url);
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
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.6 : 1,
              fontFamily: "inherit",
            }}
          >
            {saving ? "Guardando..." : image ? "Cambiar imagen" : "Subir imagen"}
          </button>
        )}
      </CldUploadWidget>

      {message && (
        <p style={{
          marginTop: "0.5rem",
          fontSize: "0.78rem",
          color: message.startsWith("✅") ? "#5C8A5E" : "#C9533D",
          textAlign: "center",
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
