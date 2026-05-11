export default function Footer() {
  const showTest = process.env.NODE_ENV === "development";

  return (
    <footer className="border-t border-[var(--border)] bg-[rgba(255,252,245,0.45)] py-10 backdrop-blur-xl">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col items-center justify-between gap-4 px-3 text-[0.75rem] font-semibold leading-normal tracking-[-0.006em] text-[var(--text-tertiary)] min-[400px]:px-4 md:flex-row md:px-8">
        <p className="max-w-md text-center md:max-w-none md:text-left">
          Built by{" "}
          <a
            href="https://abiraljain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
          >
            Abiral Jain
          </a>{" "}
          and{" "}
          <a
            href="https://www.linkedin.com/in/shreyaj169/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
          >
            Shreya Jain
          </a>
        </p>
        <div className="flex gap-2">
          <a href="#top" className="rounded-full px-3 py-2 hover:bg-white/60 hover:text-[var(--text-primary)]">
            Back to top
          </a>
          {showTest ? (
            <a href="/test" className="rounded-full px-3 py-2 hover:bg-white/60 hover:text-[var(--text-primary)]">
              Test lab
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
