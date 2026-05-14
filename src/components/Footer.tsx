import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Giới thiệu */}
          <div>
            <p className="mb-3 text-lg font-bold text-white">Japan Bag Shop</p>
            <p className="text-sm leading-6">
              Chuyên order túi xách chính hãng từ Nhật Bản về Việt Nam. Hàng
              authentic, giá tốt, ship toàn quốc.
            </p>
          </div>

          {/* Liên kết */}
          <div>
            <p className="mb-3 font-semibold text-white">Liên kết</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  Sản phẩm
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <p className="mb-3 font-semibold text-white">Liên hệ</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://zalo.me/0709166103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Zalo: 0709166103
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1EUdKktS5F/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Facebook: Japan Bag Shop
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Japan Bag Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
