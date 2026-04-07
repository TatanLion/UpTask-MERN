// @NOTE Components
import Loading from "@/components/Loading"
import ProfileForm from "@/components/profile/ProfileForm"
// @NOTE: Hooks
import { useAuth } from "@/hooks/useAuth"

export default function ProfileView() {

    const { data, isLoading } = useAuth()

    if (isLoading) return <Loading />

    if (data) return <ProfileForm data={data} />
}
