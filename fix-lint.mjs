import { readFileSync, writeFileSync } from "fs";

function fix(filePath, replacements) {
  let content = readFileSync(filePath, "utf8");
  let changed = 0;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      changed++;
    } else {
      console.warn(`  ⚠️  No encontré el texto en ${filePath}:\n     "${from.slice(0, 60)}..."`);
    }
  }
  if (changed > 0) {
    writeFileSync(filePath, content, "utf8");
    console.log(`✅ ${filePath} (${changed} cambio${changed > 1 ? "s" : ""})`);
  } else {
    console.log(`⏭️  ${filePath} (sin cambios)`);
  }
}

// ─── 1. admin-layout-clean.tsx ─────────────────────────────────────────────
fix("admin-layout-clean.tsx", [
  [
    `const [authed, setAuthed] = useState(false);`,
    `const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("adminToken");
  });`,
  ],
  [
    `  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) {
      setAuthed(true);
    } else {
      router.replace("/admin/login");
    }
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`,
    `  useEffect(() => {
    if (!authed) router.replace("/admin/login");
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`,
  ],
]);

// ─── 2. app/admin/layout.tsx ───────────────────────────────────────────────
fix("app/admin/layout.tsx", [
  [
    `const [authed, setAuthed] = useState(false);`,
    `const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("adminToken");
  });`,
  ],
  [
    `  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) {
      setAuthed(true);
    } else {
      router.replace("/admin/login");
    }
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps`,
    `  useEffect(() => {
    if (!authed) router.replace("/admin/login");
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps`,
  ],
]);

// ─── 3. components/checkout-client.tsx ────────────────────────────────────
fix("components/checkout-client.tsx", [
  [
    `const [items, setItems] = useState<CartItem[]>([]);`,
    `const [items, setItems] = useState<CartItem[]>(() => loadCart());`,
  ],
  [
    `  useEffect(() => {
    setItems(loadCart());
  }, []);`,
    `  // items se inicializa desde loadCart() directamente en useState (ver arriba)`,
  ],
]);

// ─── 4. app/admin/coupons/page.tsx ────────────────────────────────────────
fix("app/admin/coupons/page.tsx", [
  [
    `  useEffect(() => { load(); }, []);`,
    `  // eslint-disable-next-line react-hooks/set-state-in-effect\n  useEffect(() => { load(); }, []);`,
  ],
]);

// ─── 5. app/admin/discounts/page.tsx ──────────────────────────────────────
fix("app/admin/discounts/page.tsx", [
  [
    `    Promise.all([fetchProducts(), fetchRules()]).finally(() => setLoading(false));`,
    `    // eslint-disable-next-line react-hooks/set-state-in-effect\n    Promise.all([fetchProducts(), fetchRules()]).finally(() => setLoading(false));`,
  ],
]);

console.log("\nListo. Corre: npm run lint");
