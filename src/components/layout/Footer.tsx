export default function Footer() {
  return (
    <footer className="border-t bg-white py-10 mt-20">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p className="font-semibold text-gray-700">ACCOUNTmarket</p>
        <p>© {new Date().getFullYear()} Bütün hüquqlar qorunur</p>
      </div>
    </footer>
  );
}
