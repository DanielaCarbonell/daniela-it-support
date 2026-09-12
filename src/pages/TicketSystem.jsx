import { useState } from "react"
import Stats from "../components/Stats"
import TicketCard from "../components/TicketCard"
import TicketForm from "../components/TicketForm"

function TicketSystem() {

  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Wi-Fi connection problem",
      category: "Network",
      priority: "Medium",
      status: "Open",
      troubleshooting: [
        { text: "Checked Wi-Fi connection", completed: true },
        { text: "Restarted computer", completed: true },
        { text: "Ran ipconfig", completed: false },
        { text: "Restarted network adapter", completed: false },
      ],
    },

    {
      id: 2,
      title: "Microsoft 365 login issue",
      category: "Software",
      priority: "High",
      status: "In Progress",
      troubleshooting: [
        { text: "Verified username", completed: true },
        { text: "Checked internet connection", completed: true },
        { text: "Reset password", completed: false },
        { text: "Verified Microsoft 365 account", completed: false },
      ],
    },

    {
      id: 3,
      title: "Computer running slowly",
      category: "Performance",
      priority: "Low",
      status: "Resolved",
      troubleshooting: [
        { text: "Checked Task Manager", completed: true },
        { text: "Removed unnecessary startup apps", completed: true },
        { text: "Cleared temporary files", completed: true },
        { text: "Restarted computer", completed: true },
      ],
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const [newTicket, setNewTicket] = useState({
    user: "",
    title: "",
    category: "Network",
    priority: "Medium",
    description: "",
  })


  function handleSubmit(event) {

    event.preventDefault()

    const ticket = {
      id: tickets.length + 1,
      title: newTicket.title,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      troubleshooting: [
        {
          text: "Review reported issue",
          completed: false,
        },
        {
          text: "Check system configuration",
          completed: false,
        },
        {
          text: "Perform troubleshooting tests",
          completed: false,
        },
        {
          text: "Verify resolution",
          completed: false,
        },
      ],
    }

    setTickets([
      ...tickets,
      ticket,
    ])

    setNewTicket({
      user: "",
      title: "",
      category: "Network",
      priority: "Medium",
      description: "",
    })

    setShowForm(false)
  }


  function handleStatusChange(ticketId, newStatus) {

    setTickets(
      tickets.map((ticket) => {

        if (ticket.id !== ticketId) {
          return ticket
        }

        return {
          ...ticket,
          status: newStatus,

          troubleshooting:
            newStatus === "Resolved"
              ? ticket.troubleshooting.map((step) => ({
                  ...step,
                  completed: true,
                }))
              : ticket.troubleshooting,
        }
      })
    )
  }


  function handleTroubleshootingToggle(ticketId, stepIndex) {

    setTickets(
      tickets.map((ticket) => {

        if (ticket.id !== ticketId) {
          return ticket
        }

        const updatedSteps = ticket.troubleshooting.map(
          (step, index) =>
            index === stepIndex
              ? {
                  ...step,
                  completed: !step.completed,
                }
              : step
        )

        return {
          ...ticket,
          troubleshooting: updatedSteps,
        }

      })
    )
  }

  function handleDeleteTicket(ticketId) {

  setTickets(
    tickets.filter((ticket) => ticket.id !== ticketId)
  )

}


  const filteredTickets = tickets.filter((ticket) => {

    const search = searchTerm.toLowerCase()

    const matchesSearch =
      ticket.title.toLowerCase().includes(search) ||
      ticket.category.toLowerCase().includes(search) ||
      ticket.priority.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === "All" ||
      ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })


  return (

    <div className="ticket-system">

      <a href="/" className="back-link">
        ← Back to Portfolio
      </a>

      <h1>IT Support Ticket System</h1>

      <p>
        Manage and track technical support requests.
      </p>


      <Stats tickets={tickets} />


      <div className="ticket-header">

        <h2>
          Support Tickets
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
        >
          + New Ticket
        </button>

      </div>


      <div className="ticket-filters">

        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

      </div>


      {showForm && (

        <TicketForm
          newTicket={newTicket}
          setNewTicket={setNewTicket}
          onSubmit={handleSubmit}
        />

      )}


      <div className="tickets-list">

  {filteredTickets.map((ticket) => (

    <TicketCard
      key={ticket.id}
      ticket={ticket}
      onStatusChange={handleStatusChange}
      onTroubleshootingToggle={
        handleTroubleshootingToggle
      }
      onDelete={handleDeleteTicket}
    />

  ))}

</div>


      {filteredTickets.length === 0 && (

        <p className="no-results">
          No tickets found.
        </p>

      )}

    </div>
  )
}

export default TicketSystem