import { ProfileIdView } from "@/components/profile/profile-id-view";

const ProfileIdPage = (props: { params: Promise<{ profileId: string }> }) => {
  return <ProfileIdView {...props} />;
};

export default ProfileIdPage;
