import Link from "next/link";

function Header() {
  return (
    <nav className="border-b p-6">
      <p className="text-4xl font-bold">Metaverse Marketplace</p>
      <div className="flex mt-4">
        <Link href="/">
          <a className="mr-6 text-blue-600">Home</a>
        </Link>
        <Link href="/create-item">
          <a className="mr-6 text-blue-600">Sell Digital Asset</a>
        </Link>
        <Link href="/my-assets">
          <a className="mr-6 text-blue-600">My Digital Assets</a>
        </Link>
        <Link href="/creator-dashboard">
          <a className="mr-6 text-blue-600">Creator Dashboard</a>
        </Link>
      </div>
    </nav>
  );
}

export default Header;
