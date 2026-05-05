import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProtectedLayout from "../../components/ProtectedLayout";
import { TOKEN_STORAGE_KEY } from "../../lib/constants";
import { validateToken } from "../../lib/mock-data";
import { getInitials } from "../../lib/utils";

export default async function AppProtectedLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_STORAGE_KEY)?.value ?? "";
  const user = validateToken(token);

  if (!user) {
    redirect("/login");
  }

  return (
    <ProtectedLayout
      initialToken={token}
      initialUser={{
        name: user.name,
        email: user.email,
        initials: getInitials(user.name || user.email),
      }}
    >
      {children}
    </ProtectedLayout>
  );
}
