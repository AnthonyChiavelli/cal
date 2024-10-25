export default function HomeNavBar() {
  return (
    <nav className="fixed left-0 right-0 top-0 flex h-16 flex-row justify-between bg-transparent">
      <div className="flex items-center justify-center pl-14">
        <h1 className="mb-0 text-2xl">Xylum</h1>
      </div>
      <ul className="flex flex-row items-center justify-around gap-14 pr-14">
        <li>
          <a href="/app/schedule">Home</a>
        </li>
        <li>
          <a href="/app/students">About</a>
        </li>
        <li>
          <a href="/app/settings">Contact</a>
        </li>
      </ul>
    </nav>
  );
}
