function Stats({ tickets }) {

  const openTickets = tickets.filter(
    ticket => ticket.status === "Open"
  ).length

  const inProgressTickets = tickets.filter(
    ticket => ticket.status === "In Progress"
  ).length

  const resolvedTickets = tickets.filter(
    ticket => ticket.status === "Resolved"
  ).length

  return (
    <div>

      <div>
        <h3>Open</h3>
        <p>{openTickets}</p>
      </div>

      <div>
        <h3>In Progress</h3>
        <p>{inProgressTickets}</p>
      </div>

      <div>
        <h3>Resolved</h3>
        <p>{resolvedTickets}</p>
      </div>

    </div>
  )
}

export default Stats