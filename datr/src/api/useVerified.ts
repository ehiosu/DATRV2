import { useAuthStore } from "@/store/AuthStore"

export const useVerified = () => {
  const verified=useAuthStore((state)=>state.verified)
  return verified
}
