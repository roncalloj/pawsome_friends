import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <section className="grid grid-cols-3 gap-12 py-12">
      <article className="flex flex-col items-center gap-12">
        <Outlet />
      </article>
      <article className="col-span-2 h-[70dvh] overflow-hidden rounded-xl bg-secondary">
        <img src="/images/auth.webp" className="h-full w-full object-cover" />
      </article>
    </section>
  )
}
