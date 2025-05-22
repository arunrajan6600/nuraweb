export const isAdminEnabled = () => {
  // In development mode, check the environment variable
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true"
  }

  // In production mode, always return false
  return false
}
