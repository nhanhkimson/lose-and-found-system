import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/profile-form";
import { getProfile } from "@/lib/actions/profile.actions";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) {
    redirect("/login?callbackUrl=/profile");
  }

  return <ProfileForm profile={profile} />;
}
