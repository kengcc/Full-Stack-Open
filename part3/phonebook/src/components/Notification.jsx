const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }
  console.log("type: ", type)

  const className = type === "error" ? "error" : "message"

  return <div className={className}>{message}</div>
}

export default Notification
