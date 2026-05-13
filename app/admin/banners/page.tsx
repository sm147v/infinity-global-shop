"use client";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { cloudinaryLoader } from "@/lib/image";

type Banner = {
  id: number;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  alt?: string | null;
  active: boolean;
  order: number;
};

const inp: React.CSSProperties = {
  width: "100%",
  padding: ".7rem .9rem",
  borderRadius: 10,
  border: "1px solid #EDE3CD",
  background: "#F7F1E5",
  color: "#4A4F45",
  fontSize: ".95rem",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const token = () => localStorage.getItem("adminToken") || "";
  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/banners", {
      headers: { "x-admin-token": token() },
    }).catch(() => null);
    if (res?.ok) {
      const d = await res.json();
      setBanners(d.banners || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    const init = async () => { await load(); };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!editing) return;
    if (!editing.imageUrl) {
      notify("Falta la imagen", false);
      return;
    }
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch("/api/admin/banners", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": token() },
      body: JSON.stringify(editing),
    }).catch(() => null);
    if (res?.ok) {
      notify("Banner guardado ✓");
      setEditing(null);
      await load();
    } else {
      notify("Error al guardar", false);
    }
    setSaving(false);
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar este banner?")) return;
    const res = await fetch(`/api/admin/banners?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token() },
    }).catch(() => null);
    if (res?.ok) { notify("Eliminado ✓"); await load(); }
    else notify("Error al eliminar", false);
  }

  async function toggle(b: Banner) {
    const res = await fetch("/api/admin/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": token() },
      body: JSON.stringify({ ...b, active: !b.active }),
    }).catch(() => null);
    if (res?.ok) await load();
  }

  return (
    <main style={{ padding: "2rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem",
          background: toast.ok ? "#4A5D3A" : "#C9533D",
          color: "#F7F1E5", padding: ".85rem 1.25rem",
          borderRadius: 12, zIndex: 300, fontSize: ".9rem",
          boxShadow: "0 4px 16px rgba(0,0,0,.15)",
        }}>{toast.msg}</div>
      )}

      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "1.5rem",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-fraunces),Georgia,serif",
            fontSize: "1.8rem", color: "#4A5D3A",
            fontWeight: 400, margin: "0 0 0.3rem",
          }}>Banners de la portada</h1>
          <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
            {banners.length} {banners.length === 1 ? "banner" : "banners"} · Aparecen en el carrusel de la home
          </p>
        </div>
        <button
          onClick={() => setEditing({ active: true, order: banners.length + 1 })}
          style={{
            background: "#4A5D3A", color: "#F7F1E5", border: "none",
            padding: "0.85rem 1.5rem", borderRadius: 100,
            fontSize: "0.88rem", fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >+ Nuevo banner</button>
      </div>

      {loading ? (
        <p style={{ color: "#4A5D3A", textAlign: "center", padding: "3rem" }}>
          Cargando...
        </p>
      ) : banners.length === 0 ? (
        <div style={{
          background: "#FDFAF3", borderRadius: 18,
          padding: "3rem", border: "1px dashed #EDE3CD",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-fraunces),Georgia,serif",
            fontSize: "1.2rem", color: "#4A5D3A", margin: "0 0 0.5rem",
          }}>Aún no hay banners</p>
          <p style={{ color: "#4A4F45", fontSize: "0.9rem", margin: 0 }}>
            Crea tu primer banner para que aparezca en la portada
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {banners.map(b => (
            <div key={b.id} style={{
              background: "#FDFAF3", borderRadius: 18,
              border: "1px solid #EDE3CD", overflow: "hidden",
              display: "grid", gridTemplateColumns: "180px 1fr auto",
              alignItems: "center",
            }}>
              <div style={{
                width: 180, height: 100, background: "#F7F1E5",
                position: "relative",
              }}>
                <Image
                  src={b.imageUrl} alt={b.alt || ""}
                  fill sizes="180px" loader={cloudinaryLoader}
                  style={{ objectFit: "cover" }}
                />
                {!b.active && (
                  <div style={{
                    position: "absolute", top: 6, left: 6,
                    background: "rgba(201,83,61,.9)", color: "#F7F1E5",
                    fontSize: ".65rem", padding: ".2rem .5rem",
                    borderRadius: 100, fontWeight: 600,
                  }}>INACTIVO</div>
                )}
              </div>
              <div style={{ padding: ".75rem 1rem" }}>
                <p style={{
                  fontSize: ".7rem", color: "#C97B5C",
                  textTransform: "uppercase", letterSpacing: ".1em",
                  margin: "0 0 .3rem", fontWeight: 600,
                }}>Orden {b.order}</p>
                <p style={{
                  fontFamily: "var(--font-fraunces),Georgia,serif",
                  fontSize: "1.05rem", color: "#4A5D3A",
                  margin: "0 0 .25rem", fontWeight: 500,
                }}>{b.title || "(sin título)"}</p>
                <p style={{ color: "#4A4F45", fontSize: ".85rem", margin: 0 }}>
                  {b.subtitle || "—"}
                </p>
              </div>
              <div style={{
                display: "flex", flexDirection: "column",
                gap: ".4rem", padding: ".75rem 1rem",
              }}>
                <button onClick={() => setEditing(b)} style={{
                  background: "#4A5D3A", color: "#F7F1E5", border: "none",
                  padding: ".45rem .9rem", borderRadius: 100,
                  fontSize: ".8rem", cursor: "pointer", fontFamily: "inherit",
                }}>Editar</button>
                <button onClick={() => toggle(b)} style={{
                  background: "transparent", color: "#4A5D3A",
                  border: "1px solid #EDE3CD",
                  padding: ".45rem .9rem", borderRadius: 100,
                  fontSize: ".8rem", cursor: "pointer", fontFamily: "inherit",
                }}>{b.active ? "Ocultar" : "Activar"}</button>
                <button onClick={() => remove(b.id)} style={{
                  background: "transparent", color: "#C9533D",
                  border: "1px solid #EDE3CD",
                  padding: ".45rem .9rem", borderRadius: 100,
                  fontSize: ".8rem", cursor: "pointer", fontFamily: "inherit",
                }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div onClick={() => !saving && setEditing(null)} style={{
          position: "fixed", inset: 0, background: "rgba(74,93,58,.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "1rem",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#FDFAF3", borderRadius: 20, padding: "1.75rem",
            maxWidth: 540, width: "100%", maxHeight: "90vh",
            overflow: "auto", border: "1px solid #EDE3CD",
          }}>
            <h2 style={{
              fontFamily: "var(--font-fraunces),Georgia,serif",
              fontSize: "1.4rem", color: "#4A5D3A",
              fontWeight: 500, margin: "0 0 1.25rem",
            }}>{editing.id ? "Editar banner" : "Nuevo banner"}</h2>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{
                  display: "block", fontSize: ".78rem",
                  color: "#4A4F45", marginBottom: ".4rem",
                  fontWeight: 500, textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}>Imagen del banner</label>
                {editing.imageUrl && (
                  <div style={{
                    width: "100%", aspectRatio: "16/7",
                    borderRadius: 10, overflow: "hidden",
                    marginBottom: ".5rem", position: "relative",
                  }}>
                    <Image
                      src={editing.imageUrl} alt=""
                      fill sizes="500px" loader={cloudinaryLoader}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                      setEditing({ ...editing, imageUrl: result.info.secure_url });
                    }
                  }}
                >
                  {({ open }) => (
                    <button onClick={() => open()} style={{
                      width: "100%", background: "#C97B5C", color: "#F7F1E5",
                      border: "none", padding: ".7rem", borderRadius: 10,
                      fontSize: ".88rem", fontWeight: 500, cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                      📸 {editing.imageUrl ? "Cambiar imagen" : "Subir imagen"}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div>
                <label style={{
                  display: "block", fontSize: ".78rem",
                  color: "#4A4F45", marginBottom: ".4rem",
                  fontWeight: 500, textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}>Título principal (opcional)</label>
                <input
                  value={editing.title || ""}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                  style={inp} placeholder="Productos USA originales"
                />
              </div>

              <div>
                <label style={{
                  display: "block", fontSize: ".78rem",
                  color: "#4A4F45", marginBottom: ".4rem",
                  fontWeight: 500, textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}>Subtítulo (texto pequeño arriba)</label>
                <input
                  value={editing.subtitle || ""}
                  onChange={e => setEditing({ ...editing, subtitle: e.target.value })}
                  style={inp} placeholder="Bienvenida"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                <div>
                  <label style={{
                    display: "block", fontSize: ".78rem",
                    color: "#4A4F45", marginBottom: ".4rem",
                    fontWeight: 500, textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}>Texto del botón</label>
                  <input
                    value={editing.ctaText || ""}
                    onChange={e => setEditing({ ...editing, ctaText: e.target.value })}
                    style={inp} placeholder="Explorar tienda"
                  />
                </div>
                <div>
                  <label style={{
                    display: "block", fontSize: ".78rem",
                    color: "#4A4F45", marginBottom: ".4rem",
                    fontWeight: 500, textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}>Link del botón</label>
                  <input
                    value={editing.ctaUrl || ""}
                    onChange={e => setEditing({ ...editing, ctaUrl: e.target.value })}
                    style={inp} placeholder="/productos"
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: "block", fontSize: ".78rem",
                  color: "#4A4F45", marginBottom: ".4rem",
                  fontWeight: 500, textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}>Texto alternativo (SEO)</label>
                <input
                  value={editing.alt || ""}
                  onChange={e => setEditing({ ...editing, alt: e.target.value })}
                  style={inp} placeholder="Vitaminas importadas de USA"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", alignItems: "center" }}>
                <div>
                  <label style={{
                    display: "block", fontSize: ".78rem",
                    color: "#4A4F45", marginBottom: ".4rem",
                    fontWeight: 500, textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}>Orden (1 = primero)</label>
                  <input
                    type="number"
                    value={editing.order ?? 1}
                    onChange={e => setEditing({ ...editing, order: Number(e.target.value) })}
                    style={inp}
                  />
                </div>
                <label style={{
                  display: "flex", alignItems: "center", gap: ".5rem",
                  color: "#4A4F45", fontSize: ".9rem",
                  marginTop: "1.4rem", cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={editing.active !== false}
                    onChange={e => setEditing({ ...editing, active: e.target.checked })}
                  />
                  Visible en la portada
                </label>
              </div>
            </div>

            <div style={{
              display: "flex", gap: ".75rem",
              marginTop: "1.5rem", justifyContent: "flex-end",
            }}>
              <button onClick={() => setEditing(null)} disabled={saving} style={{
                background: "transparent", color: "#4A4F45",
                border: "1px solid #EDE3CD",
                padding: ".7rem 1.4rem", borderRadius: 100,
                fontSize: ".9rem", cursor: "pointer", fontFamily: "inherit",
              }}>Cancelar</button>
              <button onClick={save} disabled={saving} style={{
                background: "#4A5D3A", color: "#F7F1E5", border: "none",
                padding: ".7rem 1.4rem", borderRadius: 100,
                fontSize: ".9rem", cursor: "pointer", fontFamily: "inherit",
                fontWeight: 500, opacity: saving ? .6 : 1,
              }}>{saving ? "Guardando..." : "Guardar banner"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
