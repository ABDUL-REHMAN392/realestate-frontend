import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAF6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: "3px solid transparent",
              borderTopColor: "#3B6D11",
              borderRightColor: "#3B6D11",
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ backgroundColor: "#3B6D11" }}
          />
          <div className="relative z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm p-1.5">
            <Image
              src="/icon.png"
              alt="GharFind"
              width={36}
              height={36}
              className="object-contain animate-pulse"
              style={{ width: 36, height: 36 }}
            />
          </div>
        </div>
        <p className="text-xs font-semibold text-[#6B7280] tracking-wide animate-pulse">
          Signing In...
        </p>
      </div>
    </div>
  );
}
