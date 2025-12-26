import ReactDOM from "react-dom/client"
import App from "./App"

const persons = [
  {
    id: 1,
    name: "Ahmad",
    important: true,
  },
  {
    id: 2,
    name: "Ali",
    important: false,
  },
  {
    id: 3,
    name: "Ah Chong",
    important: true,
  },
]

ReactDOM.createRoot(document.getElementById("root")).render(
  <App persons={persons} />
)
