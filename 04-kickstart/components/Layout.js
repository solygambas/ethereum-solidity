function Layout({ children }) {
  return (
    <div>
      <h1>Im a header</h1>
      {children}
      <h2>Im a footer</h2>
    </div>
  );
}

export default Layout;
