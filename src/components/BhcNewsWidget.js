import React, { useEffect, useMemo, useRef, useState } from "react";
import "./BhcNewsWidget.css";

// drop-in, bundler-safe API base
const API_BASE =
  (typeof window !== "undefined" && window.__API_BASE__) ||
  (typeof window !== "undefined" && window.location && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : `${window.location.protocol}//${window.location.host}`);

export default function BhcNewsWidget() {
  const [data, setData] = useState({ news: [], events: [], fetchedAt: null, source: "" });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API_BASE}/public/bhc/news-events`, { signal: ctrl.signal, mode: "cors" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((e) => setErr(e.message || "Failed to load"))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) return <div className="bhc-card">Loading BHC News…</div>;
  if (err)     return <div className="bhc-card">Couldn’t load: {err}</div>;

  return (
    <div className="bhc-grid">
      <Section title="BHC News" items={data.news} />
      <Section title="BHC Events" items={data.events} />
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section className="bhc-card">
      <h3 className="bhc-title">{title}</h3>
      {(!items || items.length === 0) ? (
        <div className="bhc-inline">No items found.</div>
      ) : (
        <ul className="bhc-list">
          {items.slice(0, 10).map((it, i) => (
            <li className="bhc-item" key={i}>
              {/* Prefer backend-sanitized HTML so we preserve the mixed text+links */}
              {it.html ? (
                <span
                  className="bhc-inline"
                  dangerouslySetInnerHTML={{ __html: it.html }}
                />
              ) : (
                <span className="bhc-inline">
                  {it.title}
                  {it.url && (
                    <>
                      {" — "}
                      <a href={it.url} target="_blank" rel="noreferrer">link</a>
                    </>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
