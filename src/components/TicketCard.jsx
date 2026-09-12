function TicketCard({
  ticket,
  onStatusChange,
  onTroubleshootingToggle,
  onDelete,
}) {

  function handleNextStatus() {

    if (ticket.status === "Open") {
      onStatusChange(ticket.id, "In Progress")
    } else if (ticket.status === "In Progress") {
      onStatusChange(ticket.id, "Resolved")
    }

  }

  return (
    <div className="ticket-card">

      <span>
        #{String(ticket.id).padStart(3, "0")}
      </span>

      <h3>
        {ticket.title}
      </h3>

      <p>
        {ticket.category}
      </p>

      <p className={`priority priority-${ticket.priority.toLowerCase()}`}>
        Priority: {ticket.priority}
      </p>

      <strong>
        Status: {ticket.status}
      </strong>

      <div className="troubleshooting">

        <h4>Troubleshooting Steps</h4>

        {ticket.troubleshooting?.map((step, index) => (

          <label key={index} className="troubleshooting-step">

            <input
              type="checkbox"
              checked={step.completed}
              onChange={() =>
                onTroubleshootingToggle(ticket.id, index)
              }
            />

            <span className={step.completed ? "completed" : ""}>
              {step.text}
            </span>

          </label>

        ))}

      </div>

      <div className="ticket-actions">

        {ticket.status !== "Resolved" && (
          <button onClick={handleNextStatus}>
            {ticket.status === "Open"
              ? "Start Working"
              : "Mark as Resolved"}
          </button>
        )}

        <button
          className="delete-button"
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this ticket?"
            )

            if (confirmed) {
              onDelete(ticket.id)
            }
          }}
        >
          Delete
        </button>

      </div>

    </div>
  )
}

export default TicketCard