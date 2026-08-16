
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (authToken !== "authenticated") {
    redirect("/authenticate");
  }

  return <>{children}</>;
}

