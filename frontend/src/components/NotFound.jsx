import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center pt-24">
      <h1 className="text-2xl">Такой страницы не существует 🙁</h1>
      <Link className="text-4xl text-blue-700 " to="/">
        На главную
      </Link>
    </div>
  );
}

export default NotFound;
