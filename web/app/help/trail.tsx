// The trail at the top of a help page: Help, the area, the page, the current one marked.
export function Trail({ steps }: { steps: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Help">
      <ol className="trail">
        {steps.map((s, i) => (
          <li key={`${s.label}-${i}`} aria-current={i === steps.length - 1 ? 'page' : undefined}>
            {i === steps.length - 1 || !s.href ? s.label : <a href={s.href}>{s.label}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// The page's text, made from approved Markdown at build time with raw HTML escaped
// (help-tutorials-and-previews#AC-4).
export function HelpText({ html }: { html: string }) {
  return <div className="help-text" dangerouslySetInnerHTML={{ __html: html }} />;
}
