import { describe, expect, it } from "vitest";
import { createOrderSchema } from "../lib/validation";

describe("createOrderSchema", () => {
  it("rechaza cantidades fuera del maximo", () => {
    const parsed = createOrderSchema.safeParse({
      customerName: "Cliente Demo",
      customerPhone: "+57 3001234567",
      customerAddress: "Calle 10 # 20 - 30",
      items: [{ productId: 1, quantity: 21 }],
    });

    expect(parsed.success).toBe(false);
  });

  it("sanitiza caracteres peligrosos en nombre", () => {
    const parsed = createOrderSchema.parse({
      customerName: "<script>Ana</script>",
      customerPhone: "+57 3001234567",
      customerAddress: "Calle 10 # 20 - 30",
      items: [{ productId: 1, quantity: 2 }],
    });

    expect(parsed.customerName.includes("<")).toBe(false);
    expect(parsed.customerName.includes(">")).toBe(false);
  });
});
