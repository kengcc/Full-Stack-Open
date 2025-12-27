import ReactDOM from "react-dom/client"
import App from "./App"

const persons = [
  {
    id: 1,
    name: "Ahmad",
    number: "123-4567",
    important: true,
  },
  {
    id: 2,
    name: "Ali",
    number: "223-4567",
    important: false,
  },
  {
    id: 3,
    name: "Ah Chong",
    number: "323-4567",
    important: true,
  },
]

ReactDOM.createRoot(document.getElementById("root")).render(
  <App persons={persons} />
)
