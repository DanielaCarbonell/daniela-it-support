function TicketForm({
  newTicket,
  setNewTicket,
  onSubmit,
}) {

  function handleChange(event) {

    const { name, value } = event.target

    setNewTicket({
      ...newTicket,
      [name]: value,
    })
  }

  return (

    <form onSubmit={onSubmit}>

      <h2>Create New Ticket</h2>

      <label>
        User Name
      </label>

      <input
        type="text"
        name="user"
        value={newTicket.user}
        onChange={handleChange}
        placeholder="Enter user name"
        required
      />


      <label>
        Issue
      </label>

      <input
        type="text"
        name="title"
        value={newTicket.title}
        onChange={handleChange}
        placeholder="Example: Cannot connect to Wi-Fi"
        required
      />


      <label>
        Category
      </label>

      <select
        name="category"
        value={newTicket.category}
        onChange={handleChange}
      >
        <option>Network</option>
        <option>Hardware</option>
        <option>Software</option>
        <option>Security</option>
        <option>Account</option>
      </select>


      <label>
        Priority
      </label>

      <select
        name="priority"
        value={newTicket.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>


      <label>
        Description
      </label>

      <textarea
        name="description"
        value={newTicket.description}
        onChange={handleChange}
        placeholder="Describe the problem..."
        rows="4"
      />


      <button type="submit">
        Create Ticket
      </button>

    </form>
  )
}

export default TicketForm