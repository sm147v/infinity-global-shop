import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-4">
      <div className="card p-5">
        <h1 className="text-2xl font-bold tracking-tight">Acceso admin</h1>
        <p className="mt-2 text-sm muted">
          Ingresa el token de administrador para gestionar estados de domicilios.
        </p>

        <div className="mt-4">
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
