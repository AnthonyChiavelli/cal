export default function HomeNavBar() {
  return (
    <nav className="bg-transparent fixed left-0 right-0 top-0 h-16 flex flex-row justify-between">
      <div className="flex justify-center items-center pl-14">
        <h1 className="text-2xl mb-0">Xylum</h1>
      </div>
      <ul className="flex flex-row gap-14 items-center justify-around pr-14">
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
