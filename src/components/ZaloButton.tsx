"use client";

export default function ZaloButton() {
  return (
    <a
      href="https://zalo.me/0709166103"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1"
      aria-label="Liên hệ Zalo"
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] shadow-lg transition hover:scale-110">
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#0068FF] opacity-30" />
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
        >
          <text
            x="50%"
            y="55%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            Zalo
          </text>
        </svg>
      </div>
      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#0068FF] shadow">
        Chat ngay
      </span>
    </a>
  );
}
