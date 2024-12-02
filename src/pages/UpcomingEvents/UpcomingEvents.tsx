import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import useEvents from "../../hooks/useEvent"; 

export default function UpcomingEvents() {
  const { data } = useEvents("upcoming"); 
  const { events, loading } = data;

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <div>This is my Upcoming Events Page </div>
        <Button>
          <Link to="/login">Login</Link>
        </Button>
        <div>
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <ul>
              {events.map((event, index) => (
                <li key={index}>{event.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}