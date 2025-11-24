export default function AuthLayout({ children, illustration }) {
  return (
    <div className="min-h-screen bg-[#D3C0A6] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Illustration */}
          <div className="md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-white">
            {illustration}
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 p-8 md:p-16 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
