import { LandingContent } from "@/components/landing-content";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (session) {
    redirect("/dashboard");
  }
  return (
      <LandingContent />
  );
};

export default Page;
