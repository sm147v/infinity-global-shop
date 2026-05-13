#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🎠 CARRUSEL DE BANNERS - Setup completo
# ═══════════════════════════════════════════════════════════════
# Usa lo que ya tienes: Cloudinary + Prisma + tu admin
# No toca redirects ni nada que funcione
# ═══════════════════════════════════════════════════════════════

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🎠 Setup Carrusel de Banners                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# ─── Verificar proyecto ───
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No estás en el proyecto${NC}"
    exit 1
fi

# ─── Crear carpetas ───
echo -e "${YELLOW}📁 Creando carpetas...${NC}"
mkdir -p app/admin/banners
mkdir -p app/api/admin/banners
mkdir -p app/api/banners
echo -e "${GREEN}✓ Carpetas creadas${NC}"
echo ""

# ─── 1. Agregar modelo Banner al schema de Prisma ───
echo -e "${YELLOW}📝 Agregando modelo Banner a Prisma...${NC}"

if grep -q "^model Banner" prisma/schema.postgres.prisma; then
    echo -e "${GREEN}✓ Modelo Banner ya existe${NC}"
else
    cat >> prisma/schema.postgres.prisma << 'EOF'

model Banner {
  id          Int      @id @default(autoincrement())
  imageUrl    String
  title       String?
  subtitle    String?
  ctaText     String?
  ctaUrl      String?
  alt         String?
  active      Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([active, order])
}
EOF
    echo -e "${GREEN}✓ Modelo Banner agregado al schema${NC}"
fi
echo ""

# ─── 2. Ejecutar migración de Prisma ───
echo -e "${YELLOW}🗄️  Aplicando cambios a la base de datos...${NC}"
npx prisma generate
npx prisma db push --skip-generate
echo -e "${GREEN}✓ Base de datos actualizada${NC}"
echo ""

# ─── 3. API pública para leer banners ───
echo -e "${YELLOW}📝 Creando API pública /api/banners...${NC}"
cat > app/api/banners/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // cache 60s

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (e) {
    console.error("Error leyendo banners:", e);
    return NextResponse.json([], { status: 200 });
  }
}
EOF
echo -e "${GREEN}✓ API pública creada${NC}"

# ─── 4. API admin protegida ───
echo -e "${YELLOW}📝 Creando API admin /api/admin/banners...${NC}"
cat > app/api/admin/banners/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function auth(req: Request) {
  const t = process.env.ADMIN_TOKEN;
  return t && req.headers.get("x-admin-token") === t;
}

export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ banners });
}

export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  if (!body.imageUrl) return NextResponse.json({ error: "Falta imageUrl" }, { status: 400 });
  const banner = await prisma.banner.create({
    data: {
      imageUrl: body.imageUrl,
      title: body.title || null,
      subtitle: body.subtitle || null,
      ctaText: body.ctaText || null,
      ctaUrl: body.ctaUrl || null,
      alt: body.alt || null,
      active: body.active !== false,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json({ banner });
}

export async function PUT(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  const banner = await prisma.banner.update({
    where: { id: body.id },
    data: {
      imageUrl: body.imageUrl,
      title: body.title || null,
      subtitle: body.subtitle || null,
      ctaText: body.ctaText || null,
      ctaUrl: body.ctaUrl || null,
      alt: body.alt || null,
      active: body.active !== false,
      order: body.order ?? 0,
    },
  });
  return NextResponse.json({ banner });
}

export async function DELETE(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
EOF
echo -e "${GREEN}✓ API admin creada${NC}"

# ─── 5. Componente HeroCarousel ───
echo -e "${YELLOW}📝 Creando componente HeroCarousel...${NC}"
cat > components/HeroCarousel.tsx << 'EOF'
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
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
  active?: boolean;
  order?: number;
};

const AUTOPLAY_MS = 5500;

export default function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/banners", { cache: "no-store" })
      .then(r => r.ok ? r.json() : [])
      .then((data: Banner[]) => {
        if (cancelled) return;
        setBanners(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (banners.length <= 1) return;
    timer.current = setTimeout(() => setIdx(i => (i + 1) % banners.length), AUTOPLAY_MS);
  }, [banners.length]);

  useEffect(() => {
    start();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx, start]);

  const go = (i: number) => {
    if (banners.length === 0) return;
    setIdx(((i % banners.length) + banners.length) % banners.length);
  };

  if (!loaded || banners.length === 0) return null;

  return (
    <section
      aria-label="Banners principales"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#F7F1E5",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const d = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(d) > 50) go(idx + (d > 0 ? -1 : 1));
        touchX.current = null;
      }}
    >
      <div style={{
        display: "flex",
        transform: `translateX(-${idx * 100}%)`,
        transition: "transform 700ms cubic-bezier(0.65,0,0.35,1)",
      }}>
        {banners.map((b, i) => (
          <div key={b.id} style={{
            minWidth: "100%",
            position: "relative",
            aspectRatio: "16/7",
            minHeight: 280,
          }}>
            <Image
              src={b.imageUrl}
              alt={b.alt || b.title || "Banner"}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              loader={cloudinaryLoader}
              priority={i === 0}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {(b.title || b.ctaText) && (
              <>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.15) 55%,transparent 100%)",
                }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "clamp(1.5rem,5vw,4rem)",
                  maxWidth: "min(680px,92%)",
                }}>
                  {b.subtitle && (
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#FDFAF3",
                      marginBottom: "1rem",
                    }}>{b.subtitle}</span>
                  )}
                  {b.title && (
                    <h2 style={{
                      fontFamily: "var(--font-fraunces),Georgia,serif",
                      fontSize: "clamp(1.6rem,4vw,3rem)",
                      color: "#FDFAF3",
                      fontWeight: 400,
                      lineHeight: 1.1,
                      margin: "0 0 1.25rem",
                      letterSpacing: "-0.02em",
                      textShadow: "0 2px 10px rgba(0,0,0,.25)",
                    }}>{b.title}</h2>
                  )}
                  {b.ctaText && b.ctaUrl && (
                    <Link href={b.ctaUrl} style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      background: "#C97B5C",
                      color: "#FDFAF3",
                      padding: "0.85rem 1.85rem",
                      borderRadius: 999,
                      fontWeight: 500,
                      fontSize: "0.92rem",
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(0,0,0,.15)",
                    }}>{b.ctaText} →</Link>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => go(idx - 1)}
            aria-label="Anterior"
            style={{
              position: "absolute", left: "1rem", top: "50%",
              transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(253,250,243,.9)", border: "none",
              color: "#4A5D3A", fontSize: "1.5rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            }}
          >‹</button>
          <button
            onClick={() => go(idx + 1)}
            aria-label="Siguiente"
            style={{
              position: "absolute", right: "1rem", top: "50%",
              transform: "translateY(-50%)",
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(253,250,243,.9)", border: "none",
              color: "#4A5D3A", fontSize: "1.5rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            }}
          >›</button>
          <div style={{
            position: "absolute", bottom: "1.25rem", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            background: "rgba(0,0,0,.25)", borderRadius: 999,
          }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === idx ? 28 : 8,
                  height: 8, borderRadius: 999,
                  background: i === idx ? "#FDFAF3" : "rgba(253,250,243,.5)",
                  border: "none", cursor: "pointer",
                  transition: "all 300ms", padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
EOF
echo -e "${GREEN}✓ Componente HeroCarousel creado${NC}"

# ─── 6. Panel admin de banners ───
echo -e "${YELLOW}📝 Creando panel /admin/banners...${NC}"
cat > app/admin/banners/page.tsx << 'EOF'
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

  useEffect(() => { load(); }, []);

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
EOF
echo -e "${GREEN}✓ Panel admin creado${NC}"

# ─── 7. Agregar Banners al menú del admin ───
echo -e "${YELLOW}🎨 Agregando 'Banners' al menú del admin...${NC}"
if grep -q "admin/banners" app/admin/layout.tsx; then
    echo -e "${GREEN}✓ Ya estaba en el menú${NC}"
else
    sed -i '' 's|{ href: "/admin/discounts", label: "Descuentos", icon: "Tag" },|{ href: "/admin/discounts", label: "Descuentos", icon: "Tag" },\n  { href: "/admin/banners", label: "Banners", icon: "Imagen" },|' app/admin/layout.tsx
    echo -e "${GREEN}✓ Agregado al menú${NC}"
fi
echo ""

# ─── 8. Agregar HeroCarousel a la home ───
echo -e "${YELLOW}🏠 Agregando HeroCarousel a la home...${NC}"
if grep -q "HeroCarousel" app/page.tsx; then
    echo -e "${GREEN}✓ Ya está en la home${NC}"
else
    # Agregar import
    sed -i '' '1s|^|import HeroCarousel from "@/components/HeroCarousel";\n|' app/page.tsx
    # Insertar <HeroCarousel /> justo después del primer <div style del return
    sed -i '' 's|<div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>|<div style={{ background: "#F7F1E5", fontFamily: "var(--font-dm-sans), Inter, sans-serif" }}>\n      <HeroCarousel />|' app/page.tsx
    echo -e "${GREEN}✓ HeroCarousel agregado a la home${NC}"
fi
echo ""

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ TODO LISTO                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Ahora corre:${NC}"
echo -e "  ${GREEN}npm run dev${NC}"
echo ""
echo -e "Y abre:"
echo -e "  📍 ${BLUE}http://localhost:3000/admin/banners${NC}"
echo ""
echo -e "${YELLOW}Sigue estos pasos:${NC}"
echo -e "  1. Click ${BLUE}+ Nuevo banner${NC}"
echo -e "  2. Click ${BLUE}📸 Subir imagen${NC} (se abre Cloudinary)"
echo -e "  3. Pon título, subtítulo, link y guarda"
echo -e "  4. Abre ${BLUE}http://localhost:3000${NC} → ¡tu carrusel aparece! 🎉"
echo ""
echo -e "${YELLOW}Cuando todo esté bien, sube a producción:${NC}"
echo -e "  ${GREEN}git add .${NC}"
echo -e "  ${GREEN}git commit -m \"feat: carrusel de banners gestionable\"${NC}"
echo -e "  ${GREEN}git push${NC}"
echo ""
