import { redirect } from 'next/navigation'

export default function PostDetailPage() {
  // Redirect to dashboard - posts are viewed inline
  redirect('/day7/dashboard')
}
