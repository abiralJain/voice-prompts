export default function Footer() {
  const showTest = process.env.NODE_ENV === "development";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-[var(--text-tertiary)] md:flex-row md:px-8">
        <p>
          Built by{" "}
          <a
            href="https://abiraljain.com"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
          >
            Abiral Jain
          </a>
        </p>
        <div className="flex gap-6">
          <a href="#top" className="hover:text-[var(--text-primary)]">
            Back to top
          </a>
          {showTest ? (
            <a href="/test" className="hover:text-[var(--text-primary)]">
              Test lab
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
