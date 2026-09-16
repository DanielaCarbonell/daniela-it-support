
function TicketForm({ newTicket, setNewTicket, onSubmit, onCancel }) {
  return (
    <div className="ticket-form">

      {/* Header */}
      <div className="ticket-form-header">
        <div className="form-label-top">
          NEW SUPPORT REQUEST
        </div>

        <h2>Create New Ticket</h2>

        <p className="form-subtitle">
          Provide the details below to create a new IT support ticket.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit}>

        <div className="form-grid">

          {/* Ticket Title */}
          <div className="form-group full-width">
            <label htmlFor="ticket-title">
              Ticket Title
            </label>

            <input
              id="ticket-title"
              type="text"
              placeholder="Example: Unable to connect to Wi-Fi"
              value={newTicket.title}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="ticket-category">
              Category
            </label>

            <select
              id="ticket-category"
              value={newTicket.category}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  category: e.target.value,
                })
              }
            >
              <option value="Network">Network</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Performance">Performance</option>
              <option value="Account">Account</option>
            </select>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="ticket-priority">
              Priority
            </label>

            <select
              id="ticket-priority"
              value={newTicket.priority}
              onChange={(e) =>
                setNewTicket({
                  ...newTicket,
                  priority: e.target.value,
                })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

        </div>

        {/* Description */}
        <div className="form-group full-width">

          <label htmlFor="ticket-description">
            Description
          </label>

          <textarea
            id="ticket-description"
            placeholder="Describe the technical issue, error message, or troubleshooting already attempted..."
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({
                ...newTicket,
                description: e.target.value,
              })
            }
            rows="6"
            required
          />

          <small>
            Include as much information as possible to help troubleshoot the issue.
          </small>

        </div>

        {/* Footer */}
        <div className="ticket-form-footer">

          <div className="form-status">
            <span className="status-dot"></span>
            Ticket will be created as Open
          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
            >
              Create Ticket
            </button>

          </div>

        </div>

      </form>
    </div>
  );
}

export default TicketForm;

