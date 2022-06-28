export default function Test() {
  const switchMode = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = (() => {
      switch (current) {
        case "light":
          return "dark";
        case "dark":
          return "light";
        default:
          return "dark";
      }
    })();
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="prose">
      <button className="btn" onClick={switchMode}>
        Mode
      </button>
      <button className="btn btn-primary">abc</button>
      <button className="btn btn-secondary">abc</button>
      <button className="btn">abc</button>
      <h1>H1</h1>
      <h2>H2</h2>
      <h3>H3</h3>
      <h4>H4</h4>
      <ol>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ol>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
      <section className="prose">
        <p>あいうえお</p>
      </section>
    </div>
  );
}
