import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1d] via-[#0e1630] to-[#1a1f3b] text-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-24 px-6">
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to TheCyberCastle
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
            Crafting creative digital experiences that merge design, technology,
            and innovation.
          </p>
          <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">
            Get Started
          </button>
        </section>

        <section
          id="about"
          className="min-h-screen flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-purple-400">About Us</h2>
          <p className="text-gray-300 max-w-2xl">
            We’re passionate about building beautiful, functional web
            applications that make an impact.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
