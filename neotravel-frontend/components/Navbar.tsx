export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-5">
        <h1 className="text-2xl font-bold text-blue-700">
          NeoTravel
        </h1>

        <span className="text-sm text-gray-500">
          Transport en autocar
        </span>
      </div>
    </nav>
  );
}