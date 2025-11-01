export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          Teendex
        </h1>
        <p className="text-center text-xl text-gray-600 dark:text-gray-300">
          Gamified CRM for Gen Z Freelancers
        </p>
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Project initialized successfully! 🚀
          </p>
        </div>
      </div>
    </main>
  );
}
