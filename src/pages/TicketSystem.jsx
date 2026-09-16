
import { useEffect, useState } from "react"
import Stats from "../components/Stats"
import TicketCard from "../components/TicketCard"
import TicketForm from "../components/TicketForm"

const API_URL = "http://127.0.0.1:5000/api/tickets"

function TicketSystem() {
  const [tickets, setTickets] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [newTicket, setNewTicket] = useState({
    user: "",
    title: "",
    category: "Network",
    priority: "Medium",
    description: "",
  })

  function showSuccess(messageText) {
    setMessage(messageText)
    setErrorMessage("")

    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  function showError(errorText) {
    setErrorMessage(errorText)
    setMessage("")

    setTimeout(() => {
      setErrorMessage("")
    }, 4000)
  }

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error("Failed to load tickets")
        }

        const data = await response.json()

        const ticketsWithTroubleshooting = data.map((ticket) => ({
          ...ticket,
          troubleshooting:
            ticket.troubleshooting?.length > 0
              ? ticket.troubleshooting
              : [
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
        }))

        setTickets(ticketsWithTroubleshooting)
      } catch (error) {
        console.error("Error loading tickets:", error)
        showError("Unable to load tickets from the server.")
      }
    }

    loadTickets()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: newTicket.user,
          title: newTicket.title,
          category: newTicket.category,
          priority: newTicket.priority,
          status: "Open",
          description: newTicket.description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create ticket")
      }

      const createdTicket = await response.json()

      setTickets((currentTickets) => [
        ...currentTickets,
        createdTicket,
      ])

      setNewTicket({
        user: "",
        title: "",
        category: "Network",
        priority: "Medium",
        description: "",
      })

      setShowForm(false)

      showSuccess("Ticket created successfully.")
    } catch (error) {
      console.error("Error creating ticket:", error)
      showError("Unable to create the ticket.")
    }
  }

  async function handleStatusChange(ticketId, newStatus) {
    try {
      const response = await fetch(`${API_URL}/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update ticket")
      }

      const updatedTicket = await response.json()

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                ...updatedTicket,
                troubleshooting:
                  newStatus === "Resolved"
                    ? ticket.troubleshooting.map((step) => ({
                        ...step,
                        completed: true,
                      }))
                    : ticket.troubleshooting,
              }
            : ticket
        )
      )

      showSuccess("Ticket status updated successfully.")
    } catch (error) {
      console.error("Error updating ticket:", error)
      showError("Unable to update the ticket status.")
    }
  }

  async function saveTroubleshooting(ticketId, steps) {
    const response = await fetch(
      `${API_URL}/${ticketId}/troubleshooting`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          troubleshooting: steps,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to save troubleshooting")
    }

    return response.json()
  }

  async function handleTroubleshootingToggle(
    ticketId,
    stepIndex
  ) {
    const ticket = tickets.find(
      (currentTicket) => currentTicket.id === ticketId
    )

    if (!ticket) {
      return
    }

    const currentSteps = ticket.troubleshooting || []

    const updatedSteps = currentSteps.map((step, index) => ({
      ...step,
      completed:
        index === stepIndex
          ? !step.completed
          : step.completed,
    }))

    setTickets((currentTickets) =>
      currentTickets.map((currentTicket) =>
        currentTicket.id === ticketId
          ? {
              ...currentTicket,
              troubleshooting: updatedSteps,
            }
          : currentTicket
      )
    )

    try {
      await saveTroubleshooting(ticketId, updatedSteps)
    } catch (error) {
      console.error(
        "Error saving troubleshooting:",
        error
      )

      setTickets((currentTickets) =>
        currentTickets.map((currentTicket) =>
          currentTicket.id === ticketId
            ? {
                ...currentTicket,
                troubleshooting: currentSteps,
              }
            : currentTicket
        )
      )

      showError("Unable to save troubleshooting changes.")
    }
  }

  async function handleMarkAll(ticketId) {
    const ticket = tickets.find(
      (currentTicket) => currentTicket.id === ticketId
    )

    if (!ticket) {
      return
    }

    const updatedSteps = (
      ticket.troubleshooting || []
    ).map((step) => ({
      ...step,
      completed: true,
    }))

    setTickets((currentTickets) =>
      currentTickets.map((currentTicket) =>
        currentTicket.id === ticketId
          ? {
              ...currentTicket,
              troubleshooting: updatedSteps,
            }
          : currentTicket
      )
    )

    try {
      await saveTroubleshooting(ticketId, updatedSteps)

      showSuccess("All troubleshooting steps completed.")
    } catch (error) {
      console.error(
        "Error marking troubleshooting as completed:",
        error
      )

      setTickets((currentTickets) =>
        currentTickets.map((currentTicket) =>
          currentTicket.id === ticketId
            ? {
                ...currentTicket,
                troubleshooting: ticket.troubleshooting,
              }
            : currentTicket
        )
      )

      showError("Unable to save troubleshooting changes.")
    }
  }

  async function handleDeleteTicket(ticketId) {
    try {
      const response = await fetch(`${API_URL}/${ticketId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete ticket")
      }

      setTickets((currentTickets) =>
        currentTickets.filter(
          (ticket) => ticket.id !== ticketId
        )
      )

      showSuccess("Ticket deleted successfully.")
    } catch (error) {
      console.error("Error deleting ticket:", error)
      showError("Unable to delete the ticket.")
    }
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

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          ⚠ {errorMessage}
        </div>
      )}

      <Stats tickets={tickets} />

      <div className="ticket-header">
        <h2>Support Tickets</h2>

        <button
          type="button"
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
    onCancel={() => setShowForm(false)}
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
            onMarkAll={handleMarkAll}
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

