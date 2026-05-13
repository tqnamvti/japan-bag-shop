import Link from "next/link"

export default function Navbar() {
  return (
    <header className="border-b bg-white">
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
          Japan Bag Shop
        </Link>

        <nav className="flex gap-4 text-sm md:text-base">
          <Link href="/">
            Home
          </Link>

          <Link href="/products">
            Products
          </Link>
        </nav>
      </div>
    </header>
  )
}