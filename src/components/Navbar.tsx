import Link from "next/link"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-sm">
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          p-4
        "
      >
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Bảo Ngọc Order
        </Link>

        <nav className="flex gap-4 text-sm md:text-base">
          <Link href="/">
            Trang chủ
          </Link>

          <Link href="/products">
            Sản phẩm
          </Link>
        </nav>
      </div>
    </header>
  )
}