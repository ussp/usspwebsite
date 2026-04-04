export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h2>Page Not Found</h2>
      <p style={{ color: "#666" }}>The page you are looking for does not exist.</p>
      <a
        href="/"
        style={{ color: "#2563EB", textDecoration: "underline", marginTop: "1rem", display: "inline-block" }}
      >
        Go to Dashboard
      </a>
    </div>
  );
}
