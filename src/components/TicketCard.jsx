
function TicketCard({
  ticket,
  onStatusChange,
  onTroubleshootingToggle,
  onMarkAll,
  onDelete,
}) {
  function handleNextStatus() {
    if (ticket.status === "Open") {
      onStatusChange(ticket.id, "In Progress")
    } else if (ticket.status === "In Progress") {
      onStatusChange(ticket.id, "Resolved")
    }
  }

  function formatDate(date) {
    if (!date) {
      return "N/A"
    }

    return new Date(date).toLocaleString()
  }

  return (
    <div className="ticket-card">

      <div className="ticket-number">
        #{String(ticket.id).padStart(3, "0")}
      </div>

      <h3>{ticket.title}</h3>

      <div className="ticket-details">

        <p>
          <strong>User:</strong>{" "}
          {ticket.user_name || "N/A"}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {ticket.category}
        </p>

        <p
          className={`priority priority-${ticket.priority.toLowerCase()}`}
        >
          <strong>Priority:</strong>{" "}
          {ticket.priority}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {ticket.status}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {formatDate(ticket.created_at)}
        </p>

      </div>

      {ticket.description && (
        <div className="ticket-description">

          <h4>Description</h4>

          <p>
            {ticket.description}
          </p>

        </div>
      )}

      <div className="troubleshooting">

        <div className="troubleshooting-header">

          <h4>
            Troubleshooting Steps
          </h4>

          <button
            type="button"
            onClick={() => onMarkAll(ticket.id)}
            disabled={ticket.status === "Open"}
          >
            Mark all completed
          </button>

        </div>

        {ticket.troubleshooting?.map(
          (step, index) => (

            <label
              key={index}
              className="troubleshooting-step"
            >

              <input
                type="checkbox"
                checked={Boolean(step.completed)}
                disabled={ticket.status === "Open"}
                onChange={() =>
                  onTroubleshootingToggle(
                    ticket.id,
                    index
                  )
                }
              />

              <span
                className={
                  step.completed
                    ? "completed"
                    : ""
                }
              >
                {step.text}
              </span>

            </label>

          )
        )}

      </div>

      <div className="ticket-actions">

        {ticket.status !== "Resolved" && (
          <button
            type="button"
            onClick={handleNextStatus}
          >
            {ticket.status === "Open"
              ? "Start Working"
              : "Mark as Resolved"}
          </button>
        )}

        <button
          type="button"
          className="delete-button"
          onClick={() => {

            const confirmed =
              window.confirm(
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

