import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'

/** Legacy route — OTP sign-in lives at /sign-in/otp */
export default function VerifyOtpPage() {
  redirect(routes.signInOtp)
}
