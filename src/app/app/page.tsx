import { withPageAuthRequired } from "@auth0/nextjs-auth0";

function App() {
  return <div>Hoooome</div>;
}

export default withPageAuthRequired(App as any, { returnTo: "/app" });
