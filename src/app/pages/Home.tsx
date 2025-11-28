import { AbfallKalender } from "../components/AbfallKalender";

export const Home = () => {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      {/* Header */}
      <header className="border-b border-[#D4D2CD] bg-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            {/* Braun-inspired logo mark */}
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-semibold tracking-tight">LY</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">
              Abfallkalender
            </h1>
          </div>
          <p className="text-[#6B6B6B] text-sm tracking-wide">
            Papier- und Kartonsammlung · Lyss & Busswil · 2025
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <AbfallKalender />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D4D2CD] bg-white mt-auto">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
            <span>Quelle: Gemeinde Lyss</span>
            <span className="tracking-wide">2025</span>
          </div>
        </div>
      </footer>
    </main>
  );
};
